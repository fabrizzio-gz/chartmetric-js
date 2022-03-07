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

/*
 * Gathers all tracks in API response into a single array
 * and resturns it.
 */
const flattenTracks = (response: ApiResponse): Array<Track> => {
  let tracks: Array<Track> = [];
  response.forEach((radioStationData) =>
    tracks.concat(radioStationData.tracks)
  );
  return tracks;
};

/*
 * Sort tracks by timestamp
 */
const sortTracks = (tracks: Array<Track>): Array<Track> => {
  const sortedTracks = tracks.slice();
  sortedTracks.sort(
    (trackA, trackB) =>
      new Date(trackA.timestp).getTime() - new Date(trackB.timestp).getTime()
  );
  return sortedTracks;
};

// Helper type declarations for mediate data
interface TrackPlayCount {
  [trackName: string]: number;
}

interface TrackPlayCountWithDate {
  timestp: string;
  trackPlayCount: TrackPlayCount;
}

/*
 * Given an array of SORTED BY TIMESTAMP tracks: {timestmp, trackName}, count how
 * many times each track was played at each timestmp.
 * Returns an array of objects: {timstmp, trackPlayCount}, where timestmp represents
 * a unique date and trackPlayCount is an object of the form {[trackName]: [count]},
 * where [count] is the number of times [trackName] was played at date [timestmp].
 */
const getTrackPlayCountByDate = (
  tracks: Array<Track>
): Array<TrackPlayCountWithDate> =>
  tracks.reduce(
    (
      prevTracksByDate: Array<TrackPlayCountWithDate>,
      track: Track
    ): Array<TrackPlayCountWithDate> => {
      const n = prevTracksByDate.length;
      const prevDate = n !== 0 ? prevTracksByDate[n - 1].timestp : "";
      const currDate = track.timestp;
      if (n === 0 || prevDate !== currDate) {
        // Add track count for current timestamp
        prevTracksByDate.push({
          timestp: track.timestp,
          trackPlayCount: { [track.trackName]: 1 },
        });
        return prevTracksByDate;
      }
      // prevDate === currDate
      const currDateTrackPlayCount = prevTracksByDate[n - 1].trackPlayCount;
      const trackCount = currDateTrackPlayCount[track.trackName];
      // Update track count for current track
      currDateTrackPlayCount[track.trackName] = trackCount ? trackCount + 1 : 1;
      return prevTracksByDate;
    },
    []
  );

/*
 * Given an object {[trackName]: [playCount]} returns a tooltip string
 * of the form: "trackName1 (playCount1), trackName2 (playCount2), ..."
 */
const getTooltip = (trackPlayCount: TrackPlayCount): ToolTipString => {
  let trackStrings = [];
  for (const trackName in trackPlayCount)
    trackStrings.push(`${trackName} (${trackPlayCount[trackName]})`);

  return trackStrings.join(", ");
};

/*
 * Given an object {[trackName]: [playCount]} returns the play count
 * of all tracks combined.
 */
const getTotalPlayCount = (trackPlayCount: TrackPlayCount): number => {
  let sum = 0;
  for (const trackName in trackPlayCount) sum += trackPlayCount[trackName];

  return sum;
};

/*
 * Transforms an array of {timestmp, {[trackName]: [trackPlayCount]}}
 * objects to the desired charting library output:
 * {x: timestmp, y: [total play count], tooltip: formatted_tooltip}
 */
const getChartDataFromTrackPlayCountWithDate = (
  trackData: Array<TrackPlayCountWithDate>
): ChartData =>
  trackData.map(({ timestp, trackPlayCount }) => ({
    x: timestp,
    y: getTotalPlayCount(trackPlayCount),
    tooltip: getTooltip(trackPlayCount),
  }));

/*
 * Given an API response array, return data in the required chart library
 * format.
 */
const processApiData = (response: ApiResponse): ChartData | void => {
  const tracks = flattenTracks(response);
  const sortedTracks = sortTracks(tracks);
  const trackPlayCountByDate = getTrackPlayCountByDate(sortedTracks);
  const data = getChartDataFromTrackPlayCountWithDate(trackPlayCountByDate);
  return data;
};

const response = fetchData();
console.log(processApiData(response));
