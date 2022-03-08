"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processApiData = exports.getChartDataFromTracksByDate = exports.getTotalPlayCount = exports.getTooltip = exports.groupTracksByDate = exports.sortTracks = exports.flattenTracks = exports.fetchData = void 0;
/*
 * Dummy function that returns test data
 */
const fetchData = () => {
    // Actual API call...
    return [
        {
            id: 1293487,
            name: "KCRW",
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
exports.fetchData = fetchData;
/*
 * Gathers all tracks in API response into a single array
 * and resturns it.
 */
const flattenTracks = (response) => {
    let tracks = [];
    response.forEach((radioStationData) => (tracks = tracks.concat(radioStationData.tracks)));
    return tracks;
};
exports.flattenTracks = flattenTracks;
/*
 * Sort tracks by timestamp
 */
const sortTracks = (tracks) => {
    const sortedTracks = tracks.slice();
    sortedTracks.sort((trackA, trackB) => new Date(trackA.timestp).getTime() - new Date(trackB.timestp).getTime());
    return sortedTracks;
};
exports.sortTracks = sortTracks;
/*
 * Given an array of SORTED BY TIMESTAMP tracks: {timestmp, trackName}, count how
 * many times each track was played at each timestmp.
 * Returns an array of objects: {timstmp, trackPlayCount}, where timestmp represents
 * a unique date and trackPlayCount is an object of the form {[trackName]: [count]},
 * where [count] is the number of times [trackName] was played at date [timestmp].
 */
const groupTracksByDate = (tracks) => tracks.reduce((prevTracksByDate, track) => {
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
}, []);
exports.groupTracksByDate = groupTracksByDate;
/*
 * Given an object {[trackName]: [playCount]} returns a tooltip string
 * of the form: "trackName1 (playCount1), trackName2 (playCount2), ..."
 */
const getTooltip = (trackPlayCount) => {
    let trackStrings = [];
    for (const trackName in trackPlayCount)
        trackStrings.push(`${trackName} (${trackPlayCount[trackName]})`);
    return trackStrings.join(", ");
};
exports.getTooltip = getTooltip;
/*
 * Given an object {[trackName]: [playCount]} returns the play count
 * of all tracks combined.
 */
const getTotalPlayCount = (trackPlayCount) => {
    let sum = 0;
    for (const trackName in trackPlayCount)
        sum += trackPlayCount[trackName];
    return sum;
};
exports.getTotalPlayCount = getTotalPlayCount;
/*
 * Transforms an array of {timestmp, {[trackName]: [trackPlayCount]}}
 * objects to the desired charting library output:
 * {x: timestmp, y: [total play count], tooltip: formatted_tooltip}
 */
const getChartDataFromTracksByDate = (trackData) => trackData.map(({ timestp, trackPlayCount }) => ({
    x: timestp,
    y: getTotalPlayCount(trackPlayCount),
    tooltip: getTooltip(trackPlayCount),
}));
exports.getChartDataFromTracksByDate = getChartDataFromTracksByDate;
/*
 * Given an API response array, return data in the required chart library
 * format.
 */
const processApiData = (response) => {
    const tracks = flattenTracks(response);
    const sortedTracks = sortTracks(tracks);
    const tracksByDate = groupTracksByDate(sortedTracks);
    const data = getChartDataFromTracksByDate(tracksByDate);
    return data;
};
exports.processApiData = processApiData;
const response = fetchData();
console.log(processApiData(response));
