import { Network } from "../network/network";
import { Timetable } from "../timetable/timetable";
import { readTtblMetadata } from "./read-ttbl-metadata";
import { readTtblSection } from "./read-ttbl-section";

const ttblVersion = "2";
export type TtblSection = {
  header: string,
  content: string[]
}

/**
 * Parse the given content of a .ttbl file into a {@link Timetable} object.
 * @param text The content of the .ttbl file.
 * @param network The stops and lines information also just downloaded.
 */
export function readTtbl(text: string, network: Network): Timetable {
  const fileSections = splitSections(text);
  if (fileSections.length < 2) { throw notEnoughSections(); }

  // The first section must be the metadata.
  const metadata = readTtblMetadata(fileSections[0]);

  // The rest of the sections must have timetable content.
  const fileSectionsWithTimetable = fileSections.slice(1);

  // Keeping a running index going while reading sections, since entries are
  // accessed by timetable ID and index within timetable (so the index is shared
  // between sections).
  let currentIndex = 0;
  const sections = fileSectionsWithTimetable.map(s => {
    const section = readTtblSection(s, metadata.line, currentIndex, network);

    // Entries have multiple indices, one for each day of the week they occur
    // on.
    currentIndex += section.entries.length * section.wdr.numOfDays();

    return section;
  });

  return new Timetable(
    metadata.id, metadata.line, metadata.created, metadata.type,
    metadata.begins, metadata.ends, sections
  );
}

/**
 * Split the text into timetable sections, by detecting the lines with "[" and
 * "]" and the start and end.
 * @param text The .ttbl file's contents.
 */
export function splitSections(text: string): TtblSection[] {
  // Split the file into lines, removing empty lines, and trimming whitespace.
  const lines = text.split("\n").map(s => s.trim()).filter(s => s.length != 0);

  // Ensure the file has the timetable header and is the supported version.
  if (lines[0] != "[timetable]" || lines[1] != `version: ${ttblVersion}`) {
    throw badFormat();
  }

  const sections: TtblSection[] = [];
  let prevSectionStartIndex: number | null = null;

  // Intentionally loop one past the end of the number of lines...
  for (let i = 0; i <= lines.length; i++) {

    // If in the last loop (beyond the end of the file), or reached a header...
    if (i == lines.length || (lines[i].startsWith("[") && lines[i].endsWith("]"))) {

      // If a section was being tracked, you've found the end of it, so submit
      // it.
      if (prevSectionStartIndex != null) {
        const header = lines[prevSectionStartIndex];
        const headerStripped = header.substring(1, header.length - 1);
        const content = lines.slice(prevSectionStartIndex + 1, i);
        sections.push({ header: headerStripped, content: content });
      }

      // And start tracking the next section (irrelevant for end of file, but
      // that's ok).
      prevSectionStartIndex = i;
    }
  }

  return sections;
}

/**
 * Timetable file (.ttbl) in unrecognized format.
 */
const badFormat = () => new Error(
  "Timetable file (.ttbl) file in unrecognized format."
);

/**
 * Timetable file (.ttbl) didn't have enough sections. Expected metadata and one
 * section with timetable content as a minimum.
 */
const notEnoughSections = () => new Error(
  "Timetable file (.ttbl) didn't have enough sections. Expected metadata and " +
  "one section with timetable content as a minimum."
);
