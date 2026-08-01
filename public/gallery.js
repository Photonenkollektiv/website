(function (root, factory) {
  root.PhotonenGallery = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function isVideo(item) {
    return item.type === "video";
  }

  function compareItems(left, right) {
    if (left.year !== right.year) return right.year - left.year;
    if (left.isMisc !== right.isMisc) return left.isMisc ? 1 : -1;

    const dateOrder = String(right.eventDate).localeCompare(String(left.eventDate));
    if (dateOrder !== 0) return dateOrder;

    return String(left.event).localeCompare(String(right.event));
  }

  function sortItems(items) {
    return items.slice().sort(compareItems);
  }

  function groupItems(items) {
    return sortItems(items).reduce(function (groups, item) {
      const previous = groups[groups.length - 1];
      const key = item.year + ":" + item.event;

      if (!previous || previous.key !== key) {
        groups.push({
          key: key,
          year: item.year,
          event: item.event,
          eventEn: item.eventEn,
          items: [item]
        });
      } else {
        previous.items.push(item);
      }

      return groups;
    }, []);
  }

  function formatDuration(seconds) {
    const totalSeconds = Math.max(0, Math.round(Number(seconds) || 0));
    const minutes = Math.floor(totalSeconds / 60);
    const remainder = String(totalSeconds % 60).padStart(2, "0");
    return minutes + ":" + remainder;
  }

  return {
    isVideo: isVideo,
    sortItems: sortItems,
    groupItems: groupItems,
    formatDuration: formatDuration
  };
});
