interface Track {
  timestp: string;
  trackName: string;
}

interface RadioStationData {
  id: number;
  name: string;
  tracks: Array<Track>;
}

type ApiResponse = Array<RadioStationData>;

// <track_name1> (<play_count1>), <track_name2> (<play_count2>), ...
type ToolTipString = string;

interface ChartDataObject {
  x: string;
  y: number;
  tooltip: ToolTipString;
}

type ChartData = Array<ChartDataObject>;

/*
 * Dummy function that returns test data
 */
const fetchData = (): ApiResponse => {
  // Actual API call...
  return [
    {
      id: 1293487,
      name: "KCRW", // radio station callsign
      tracks: [{ timestp: "2021-04-08", trackName: "Peaches" }],
    },
    {
      id: 12923,
      name: "KQED",
      tracks: [
        { timestp: "2021-04-09", trackName: "Savage" },
        { timestp: "2021-04-09", trackName: "Savage (feat. Beyonce)" },
        { timestp: "2021-04-08", trackName: "Savage" },
        { timestp: "2021-04-08", trackName: "Savage" },
        { timestp: "2021-04-08", trackName: "Savage" },
      ],
    },
    {
      id: 4,
      name: "WNYC",
      tracks: [
        { timestp: "2021-04-09", trackName: "Captain Hook" },
        { timestp: "2021-04-08", trackName: "Captain Hook" },
        { timestp: "2021-04-07", trackName: "Captain Hook" },
      ],
    },
  ];
};