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
