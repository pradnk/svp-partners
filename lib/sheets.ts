export interface Partner {
  name: string;
  yearEstablished: string;
  legalStatus: string;
  address: string;
  website: string;
  contactPerson: string;
  contactPerson2: string;
  mission: string;
  focuses: string[];
  serviceDescription: string;
  serviceAreas: string;
  focusArea: string;
  clientBase: string;
  targetSectors: string;
  targetOrgSize: string;
  trainingFormats: string;
  programDuration: string;
  feeStructure: string;
  costPerOrg: string;
  staffStrength: string;
  orgsTrainedCount: string;
  majorAchievements: string;
  email: string;
  collaborationOpportunities: string;
  additionalFocusAreas: string[];
}

const SHEET_ID = '1ZKUJX53bNGfduy9wyBpykxpjd-_xaIy1Mabo4RRxr0g';

type GVizCell = { v: unknown } | null;
type GVizRow = { c: GVizCell[] | null };

function cell(row: GVizRow, i: number): string {
  if (!row.c || !row.c[i] || (row.c[i] as { v: unknown }).v == null) return '';
  return String((row.c[i] as { v: unknown }).v).trim();
}

export async function fetchPartners(): Promise<Partner[]> {
  const res = await fetch(
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`,
    { cache: 'no-store' }
  );
  const text = await res.text();
  // Strip JSONP wrapper: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
  const jsonStr = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  const data = JSON.parse(jsonStr);

  return (data.table.rows as GVizRow[])
    .filter((row) => row.c?.[1] && (row.c[1] as { v: unknown }).v)
    .map((row) => ({
      name: cell(row, 1),
      yearEstablished: cell(row, 2),
      legalStatus: cell(row, 3),
      address: cell(row, 4),
      website: cell(row, 5),
      contactPerson: cell(row, 6),
      contactPerson2: cell(row, 7),
      mission: cell(row, 8),
      focuses: [cell(row, 9), cell(row, 10), cell(row, 11), cell(row, 12)].filter(Boolean),
      serviceDescription: cell(row, 13),
      serviceAreas: cell(row, 14),
      focusArea: cell(row, 15),
      clientBase: cell(row, 16),
      targetSectors: cell(row, 17),
      targetOrgSize: cell(row, 18),
      trainingFormats: cell(row, 19),
      programDuration: cell(row, 20),
      feeStructure: cell(row, 21),
      costPerOrg: cell(row, 22),
      staffStrength: cell(row, 26),
      orgsTrainedCount: cell(row, 31),
      majorAchievements: cell(row, 32),
      email: cell(row, 38),
      collaborationOpportunities: cell(row, 39),
      // AO–AW (indices 40–48) are additional focus area columns
      additionalFocusAreas: Array.from({ length: 9 }, (_, i) => cell(row, 40 + i)).filter(Boolean),
    }));
}
