import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
import { exit } from "process";
import favicon from "serve-favicon";
import { getGuestToken, search, tweet, tweetThread, user } from "./funcs";
import cors from "cors";
import path from "path";
config();

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN as string;
if (!BEARER_TOKEN) {
  exit(1);
}

const app: Express = express();
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(
  cors({
    origin: "*",
  })
);

function getTweetApiUrl(id: string, type: string, cursor?: string) {
  if (type === "tweet") {
    if (cursor) {
      return `https://twitter.com/i/api/graphql/WzJjibAcDa-oCjCcLOotcg/UserTweets?variables=%7B%22userId%22%3A%22${id}%22%2C%22count%22%3A120%2C%22cursor%22%3A%22${cursor}%22%2C%22includePromotedContent%22%3Atrue%2C%22withQuickPromoteEligibilityTweetFields%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D&features=%7B%22rweb_lists_timeline_redesign_enabled%22%3Afalse%2C%22blue_business_profile_image_shape_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22vibe_api_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Afalse%2C%22interactive_text_enabled%22%3Atrue%2C%22responsive_web_text_conversations_enabled%22%3Afalse%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`;
    }
    return `https://twitter.com/i/api/graphql/WzJjibAcDa-oCjCcLOotcg/UserTweets?variables=%7B%22userId%22%3A%22${id}%22%2C%22count%22%3A120%2C%22includePromotedContent%22%3Atrue%2C%22withQuickPromoteEligibilityTweetFields%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D&features=%7B%22rweb_lists_timeline_redesign_enabled%22%3Afalse%2C%22blue_business_profile_image_shape_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22vibe_api_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Afalse%2C%22interactive_text_enabled%22%3Atrue%2C%22responsive_web_text_conversations_enabled%22%3Afalse%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`;
  } else if (type === "user") {
    return `https://twitter.com/i/api/graphql/pVrmNaXcxPjisIvKtLDMEA/UserByScreenName?variables=%7B%22screen_name%22%3A%22${id}%22%2C%22withSafetytypeUserFields%22%3Atrue%7D&features=%7B%22blue_business_profile_image_shape_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22highlights_tweets_tab_ui_enabled%22%3Atrue%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Afalse%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%7D`;
  } else if (type === "tweetDetail") {
    if (cursor) {
      return `https://twitter.com/i/api/graphql/miKSMGb2R1SewIJv2-ablQ/TweetDetail?variables=%7B%22focalTweetId%22%3A%22${id}%22%2C%22cursor%22%3A%22${cursor}%22%2C%22referrer%22%3A%22tweet%22%2C%22with_rux_injections%22%3Afalse%2C%22includePromotedContent%22%3Atrue%2C%22withCommunity%22%3Atrue%2C%22withQuickPromoteEligibilityTweetFields%22%3Atrue%2C%22withBirdwatchNotes%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D&features=%7B%22rweb_lists_timeline_redesign_enabled%22%3Afalse%2C%22blue_business_profile_image_shape_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22vibe_api_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Afalse%2C%22interactive_text_enabled%22%3Atrue%2C%22responsive_web_text_conversations_enabled%22%3Afalse%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`;
    }
    return `https://twitter.com/i/api/graphql/miKSMGb2R1SewIJv2-ablQ/TweetDetail?variables=%7B%22focalTweetId%22%3A%22${id}%22%2C%22count%22%3A40%2C%22with_rux_injections%22%3Afalse%2C%22includePromotedContent%22%3Atrue%2C%22withCommunity%22%3Atrue%2C%22withQuickPromoteEligibilityTweetFields%22%3Atrue%2C%22withBirdwatchNotes%22%3Afalse%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D&features=%7B%22rweb_lists_timeline_redesign_enabled%22%3Afalse%2C%22blue_business_profile_image_shape_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22vibe_api_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Afalse%2C%22interactive_text_enabled%22%3Atrue%2C%22responsive_web_text_conversations_enabled%22%3Afalse%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`;
  } else if (type === "search") {
    return `https://twitter.com/i/api/1.1/search/typeahead.json?include_ext_is_blue_verified=1&include_ext_verified_type=1&include_ext_profile_image_shape=1&q=${id}&src=search_box&result_type=events%2Cusers%2Ctopics`;
  } else {
    return null;
  }
}

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Twitter API",
    paths: [
      {
        path: "/twitter",
        description: "Get tweets from a user",
        params: [
          {
            name: "id",
            description: "The user's id or tweet id",
            args: [
              "/twitter?id=elonmusk&type=user",
              {
                name: "user",
                description: "Get a User",
                exp: "/twitter?id=purplebixi&type=user",
              },
              {
                name: "tweetDetail",
                description: "Get a Tweet Detail",
                exp: "/twitter?id=1234567890&type=tweetDetail",
              },
              {
                name: "tweet",
                description: "Get a Tweet",
                exp: "/twitter?id=1234567890&type=tweet",
              },
              {
                name: "search",
                description: "Search for a user",
                exp: "/twitter?id=elonmu&type=search",
              },
            ],
          },
          {
            name: "type",
            description: "The type of tweets to get",
            args: ["user", "tweet", "tweetDetail", "search"],
          },
          {
            name: "cursor",
            description: "The cursor to use",
          },
        ],
      },
    ],
  });
});

app.get("/twitter", async (req: Request, res: Response) => {
  const id = req.query.id as string;
  const type = req.query.type as string;
  const cursor = req.query.cursor as string;
  const tweetApiUrl = getTweetApiUrl(id, type, cursor);
  const guestToken = await getGuestToken(BEARER_TOKEN);
  if (!guestToken) {
    res.status(400).send("Invalid guest token");
    return;
  }
  if (!tweetApiUrl) {
    res.status(400).send("Invalid type");
    return;
  }
  try {
    const response = await fetch(tweetApiUrl, {
      headers: {
        Authorization: BEARER_TOKEN,
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        "x-twitter-active-user": "yes",
        "X-Guest-Token": guestToken,
        referrer: `https:://twitter.com`,
      },
    });
    let resp = await response.json();
    let response_data = {};
    if (type === "tweetDetail") {
      let data = resp.data.threaded_conversation_with_injections_v2.instructions
        .find((i: any) => i.type === "TimelineAddEntries")
        .entries.map((item: any) => {
          if (item.entryId.startsWith("tweet")) {
            return tweet(item);
          } else if (item.entryId.includes("conversationthread")) {
            return tweetThread(item);
          }
        })
        .filter((item: any) => item);
      let cursor =
        resp.data.threaded_conversation_with_injections_v2.instructions
          .find((item: any) => item.type == "TimelineAddEntries")
          .entries.find((item: any) => {
            if (item.entryId.includes("cursor")) {
              return item;
            }
          });
      response_data = {
        id,
        type,
        url:
          data[0].user &&
          `https://twitter.com/${data[0].user.username}/status/${id}`,
        more:
          cursor &&
          `/twitter?id=${id}&type=${type}&cursor=${cursor.content.itemContent.value}`,
        data: data && data,
      };
    } else if (type === "user") {
      if (String(resp.data) === new Object()) {
        response_data = {
          id,
          type,
          user: null,
        };
      } else {
        let data = user(resp.data.user.result);
        response_data = {
          id,
          type,
          data,
        };
      }
    } else if (type === "tweet") {
      let tweets = resp.data.user.result.timeline_v2.timeline.instructions
        .find((item: any) => item.type == "TimelineAddEntries")
        .entries.map((item: any) => {
          if (item.entryId.startsWith("tweet")) {
            let data: any = tweet(item);
            data["detail"] = `/twitter?id=${data.id}&type=tweetDetail`;
            return data;
          }
        });
      let cursor = resp.data.user.result.timeline_v2.timeline.instructions
        .find((item: any) => item.type == "TimelineAddEntries")
        .entries.find((item: any) => {
          if (item.entryId.includes("bottom")) {
            return item;
          }
        });
      response_data = {
        id: id,
        type: "tweet",
        more_tweets:
          cursor &&
          `/twitter?id=${id}&type=tweet&cursor=${cursor.content.value}`,
        data: tweets && tweets.filter((item: any) => item),
      };
    } else if (type === "search") {
      response_data = {
        id,
        type,
        data: resp.users.map((item: any) => search(item)),
      };
    }
    res.status(200).json(response_data);
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ error: e.message || "Internal Server Error" });
  }
});

app.listen(5000, () => console.log(`Server running on port ${5000}`));
