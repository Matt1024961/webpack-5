export type SectionsTable = {
  id: number;
  reportFile: string;
  longName: string;
  shortName: string;
  groupType: string | null;
  subGroup: string;
  contextRef: string | null;
  name: string | null;
  baseRef: string | null;
  isActive: boolean;
};
