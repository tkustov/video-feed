const reUrlTitle = /\/([^/]+)(?:\.[^/]+)?$/;
const SOURCES = {
    "youtube": {
        getUrl: ({ videoId }) => `https://www.youtube.com/embed/${videoId}`,
        getTitle: ({ title }) => title,
        template: "tk-video-feed-item/youtube"
    },
    "facebook": {
        getUrl: ({ videoId }) => `https://www.facebook.com/video.php?v=${videoId}`,
        getTitle: ({ title }) => title,
        template: "tk-video-feed-item/facebook"
    },
    "url": {
        getUrl: ({ url }) => url,
        getTitle: ({ url }) => {
            const match = url.match(reUrlTitle);
            return match ? match[1] : "Video";
        },
        template: "tk-video-feed-item/url"
    }
};

class VideoFeedItem {
    static get $inject() { return ["$sce"]; }
    constructor($sce) {
        this.$sce = $sce;
        this.template = undefined;
    }

    $onChanges({ item }) {
        if (item && item.currentValue) {
            const { source } = item.currentValue;
            if (source && SOURCES.hasOwnProperty(source)) {
                const { getUrl, getTitle, template } = SOURCES[source];
                this.template = template;
                this.videoUrl = this.$sce.trustAsResourceUrl(getUrl(item.currentValue));
                this.videoTitle = getTitle(item.currentValue);
            }
        }
    }    
}

registerTemplates.$inject = ["$templateCache"];
export function registerTemplates($templatesCache) {
    $templatesCache.put("tk-video-feed-item/youtube", `
        <iframe ng-src="{{$videoFeedItem.videoUrl}}"
                width="420"
                height="315"></iframe>
    `);
    $templatesCache.put("tk-video-feed-item/facebook", `
        <div class="fb-video"
             ng-attr-data-href="{{$videoFeedItem.videoUrl}}"
             data-width="420"
             data-allowfullscreen="true"></div>
    `);
    $templatesCache.put("tk-video-feed-item/url", `
        <video ng-src="{{$videoFeedItem.videoUrl}}"
               width="420"
               heihgt="315"
               controls></video>
    `);
}

export default {
    bindings: {
        item: "<"
    },
    controller: VideoFeedItem,
    controllerAs: "$videoFeedItem",
    template: `
        <section>
            <header>
                <span class="title" ng-bind="$videoFeedItem.videoTitle"></span>
                <span class="views" ng-bind="$videoFeedItem.item.views | tkVideoViewsCount"></span>
            </header>
            <div class="video" ng-if="$videoFeedItem.template" ng-include="$videoFeedItem.template"></div>
        </section>
    `
}
