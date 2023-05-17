import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
import { exit } from "process";

config();

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN as string;
if (!BEARER_TOKEN) {
  exit(1);
}

const app: Express = express();

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
  } else {
    return null;
  }
}

app.get("/", async (req: Request, res: Response) => {
  return {
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
              "/twitter?id=1234567890&type=tweet",
            ],
          },
          {
            name: "type",
            description: "The type of tweets to get",
            args: ["user", "tweet", "tweetDetail"],
          },
          {
            name: "cursor",
            description: "The cursor to use",
          },
        ],
      },
    ],
  };
});

async function getGuestToken() {
  try {
    let headers = {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "accept-encoding": "gzip",
      "accept-language": "en-US,en;q=0.5",
      "Content-Type": "application/json",
      connection: "keep-alive",
      authorization: BEARER_TOKEN,
    };
    const response = await fetch(
      "https://api.twitter.com/1.1/guest/activate.json",
      {
        method: "POST",
        headers: headers,
      }
    );
    const data = await response.json();
    return data.guest_token;
  } catch (e: any) {
    return null;
  }
}

app.get("/twitter", async (req: Request, res: Response) => {
  const id = req.query.id as string;
  const type = req.query.type as string;
  const cursor = req.query.cursor as string;
  const tweetApiUrl = getTweetApiUrl(id, type, cursor);
  const guestToken = await getGuestToken();
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
          const content = item.content;
          if (item.entryId.startsWith("tweet")) {
            const tw_result = content.itemContent.tweet_results.result;
            const tw_user =
              content.itemContent.tweet_results.result.core.user_results.result;
            return {
              id: tw_result.legacy.id_str,
              entryId: item.entryId,
              url: `https://twitter.com/${tw_user.legacy.screen_name}/status/${tw_result.legacy.id_str}`,
              text: tw_result.legacy.full_text,
              user: {
                id: tw_user.rest_id,
                name: tw_user.legacy.name,
                username: tw_user.legacy.screen_name,
                url: `https://twitter.com/${tw_user.legacy.screen_name}`,
                description: tw_user.legacy.description,
                location: tw_user.legacy.location,
                entities: tw_user.legacy.entities,
                image: {
                  profile: tw_user.legacy.profile_image_url_https,
                  banner: tw_user.legacy.profile_banner_url,
                },
                followers_count: tw_user.legacy.followers_count,
                following_count: tw_user.legacy.friends_count,
                media_count: tw_user.legacy.media_count,
                favourites_count: tw_user.legacy.favourites_count,

                verified: tw_user.legacy.verified,
              },
              entities:
                tw_result.legacy.extended_entities &&
                tw_result.legacy.extended_entities.media
                  .map((item: any) => {
                    if (item.type === "photo") {
                      return {
                        id: item.id_str,
                        type: item.type,
                        url: item.url,
                        expanded_url: item.expanded_url,
                        media_key: item.media_key,
                        media_url: item.media_url_https,
                        info: {
                          width: item.original_info.width,
                          height: item.original_info.height,
                        },
                      };
                    } else if (item.type === "video") {
                      return {
                        id: item.id_str,
                        type: item.type,
                        url: item.url,
                        expanded_url: item.expanded_url,
                        media_key: item.media_key,
                        media_url: item.media_url_https,
                        info: {
                          width: item.original_info.width,
                          height: item.original_info.height,
                        },
                        video: {
                          aspect_ration: item.original_info.aspect_ratio,
                          duration_ms: item.duration_millis,
                          variants: item.video_info.variants
                            .map((item: any) => {
                              if (item.bitrate) {
                                return {
                                  url: item.url,
                                  content_type: item.content_type,
                                  bitrate: item.bitrate,
                                };
                              }
                            })
                            .filter((item: any) => item),
                        },
                      };
                    }
                  })
                  .filter((item: any) => item),
              views: tw_result.views.count,
              lang: tw_result.legacy.lang,
              reply_count: tw_result.legacy.reply_count,
              retweet_count: tw_result.legacy.retweet_count,
              favorite_count: tw_result.legacy.favorite_count,
              quote_count: tw_result.legacy.quote_count,
              created_at: tw_result.legacy.created_at,
            };
          } else if (item.entryId.includes("conversationthread")) {
            const tw_result =
              content.items[0].item.itemContent.tweet_results.result;
            const tw_user =
              content.items[0].item.itemContent.tweet_results.result.core
                .user_results.result;
            return {
              id: tw_result.legacy.id_str,
              entryId: item.entryId,
              url: `https://twitter.com/${tw_user.legacy.screen_name}/status/${tw_result.legacy.id_str}`,
              text: tw_result.legacy.full_text,
              user: {
                id: tw_user.rest_id,
                name: tw_user.legacy.name,
                username: tw_user.legacy.screen_name,
                url: `https://twitter.com/${tw_user.legacy.screen_name}`,
                description: tw_user.legacy.description,
                location: tw_user.legacy.location,
                entities: tw_user.legacy.entities,
                image: {
                  profile: tw_user.legacy.profile_image_url_https,
                  banner: tw_user.legacy.profile_banner_url,
                },
                followers_count: tw_user.legacy.followers_count,
                following_count: tw_user.legacy.friends_count,
                media_count: tw_user.legacy.media_count,
                favourites_count: tw_user.legacy.favourites_count,

                verified: tw_user.legacy.verified,
              },
              entities:
                tw_result.legacy.extended_entities &&
                tw_result.legacy.extended_entities.media
                  .map((item: any) => {
                    if (item.type === "photo") {
                      return {
                        id: item.id_str,
                        type: item.type,
                        url: item.url,
                        expanded_url: item.expanded_url,
                        media_key: item.media_key,
                        media_url: item.media_url_https,
                        info: {
                          width: item.original_info.width,
                          height: item.original_info.height,
                        },
                      };
                    } else if (item.type === "video") {
                      return {
                        id: item.id_str,
                        type: item.type,
                        url: item.url,
                        expanded_url: item.expanded_url,
                        media_key: item.media_key,
                        media_url: item.media_url_https,
                        info: {
                          width: item.original_info.width,
                          height: item.original_info.height,
                        },
                        video: {
                          aspect_ration: item.original_info.aspect_ratio,
                          duration_ms: item.duration_millis,
                          variants: item.video_info.variants
                            .map((item: any) => {
                              if (item.bitrate) {
                                return {
                                  url: item.url,
                                  content_type: item.content_type,
                                  bitrate: item.bitrate,
                                };
                              }
                            })
                            .filter((item: any) => item),
                        },
                      };
                    }
                  })
                  .filter((item: any) => item),
              views: tw_result.views.count,
              lang: tw_result.legacy.lang,
              reply_count: tw_result.legacy.reply_count,
              retweet_count: tw_result.legacy.retweet_count,
              favorite_count: tw_result.legacy.favorite_count,
              quote_count: tw_result.legacy.quote_count,
              created_at: tw_result.legacy.created_at,
            };
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
        url: `https://twitter.com/${data[0].user.username}/status/${id}`,
        cursor: cursor,
        more: `/twitter?id=${id}&type=${type}&cursor=${cursor.content.itemContent.value}`,
        data: data,
      };
    } else if (type === "user") {
      if (String(resp.data) === new Object()) {
        response_data = {
          id,
          type,
          user: null,
        };
      } else {
        let suser = resp.data.user.result;
        let data = {
          id: suser.rest_id,
          name: suser.legacy.name,
          username: suser.legacy.screen_name,
          url: `https://twitter.com/${suser.legacy.screen_name}`,
          description: suser.legacy.description,
          location: suser.legacy.location,
          entities: suser.legacy.entities,
          image: {
            profile:
              suser.legacy.profile_image_url_https &&
              suser.legacy.profile_image_url_https,
            banner:
              suser.legacy.profile_banner_url &&
              suser.legacy.profile_banner_url,
          },
          followers_count: suser.legacy.followers_count,
          following_count: suser.legacy.friends_count,
          media_count: suser.legacy.media_count,
          favourites_count: suser.legacy.favourites_count,
          default_profile: suser.legacy.default_profile,
          professional: suser.professional && suser.professional,
          extended_profile_info:
            suser.legacy_extended_profile && suser.legacy_extended_profile,
          verified: suser.legacy.verified,
          tweets: `/twitter?id=${suser.rest_id}&type=tweet`,
        };
        response_data = {
          id,
          type,
          data: data,
        };
      }
    } else if (type === "tweet") {
      let tweets = resp.data.user.result.timeline_v2.timeline.instructions
        .find((item: any) => item.type == "TimelineAddEntries")
        .entries.map((item: any) => {
          if (item.entryId.startsWith("tweet")) {
            const tw_result = item.content.itemContent.tweet_results.result;
            const tw_user =
              item.content.itemContent.tweet_results.result.core.user_results
                .result;
            const rtw_result = tw_result.legacy.retweeted_status_result;
            return {
              type: item.content.itemContent.itemType,
              id: tw_result.legacy.id_str,
              url: `https://twitter.com/${tw_user.legacy.screen_name}/status/${tw_result.legacy.id_str}`,
              entryId: item.entryId,
              text: tw_result.legacy.full_text,
              user: {
                id: tw_user.rest_id,
                name: tw_user.legacy.name,
                username: tw_user.legacy.screen_name,
                url: `https://twitter.com/${tw_user.legacy.screen_name}`,
                description: tw_user.legacy.description,
                location: tw_user.legacy.location,
                entities: tw_user.legacy.entities,
                image: {
                  profile: tw_user.legacy.profile_image_url_https,
                  banner: tw_user.legacy.profile_banner_url,
                },
                followers_count: tw_user.legacy.followers_count,
                following_count: tw_user.legacy.friends_count,
                media_count: tw_user.legacy.media_count,
                reply_count: tw_user.legacy.reply_count,
                favourites_count: tw_user.legacy.favourites_count,
                verified: tw_user.legacy.verified,
              },
              entities:
                tw_result.legacy.extended_entities &&
                tw_result.legacy.extended_entities.media
                  .map((item: any) => {
                    if (item.type === "photo") {
                      return {
                        id: item.id_str,
                        type: item.type,
                        url: item.url,
                        expanded_url: item.expanded_url,
                        media_key: item.media_key,
                        media_url: item.media_url_https,
                        info: {
                          width: item.original_info.width,
                          height: item.original_info.height,
                        },
                        source: item.source_status_id_str && {
                          id:
                            item.source_status_id_str &&
                            item.source_status_id_str,
                          user_id:
                            item.source_user_id_str && item.source_user_id_str,
                        },
                      };
                    } else if (item.type === "video") {
                      return {
                        id: item.id_str,
                        type: item.type,
                        url: item.url,
                        expanded_url: item.expanded_url,
                        media_key: item.media_key,
                        media_url: item.media_url_https,
                        info: {
                          width: item.original_info.width,
                          height: item.original_info.height,
                        },
                        video: {
                          aspect_ration: item.original_info.aspect_ratio,
                          duration_ms: item.duration_millis,
                          variants: item.video_info.variants
                            .map((item: any) => {
                              if (item.bitrate) {
                                return {
                                  url: item.url,
                                  content_type: item.content_type,
                                  bitrate: item.bitrate,
                                };
                              }
                            })
                            .filter((item: any) => item),
                        },
                        source: item.source_status_id_str && {
                          id:
                            item.source_status_id_str &&
                            item.source_status_id_str,
                          user_id:
                            item.source_user_id_str && item.source_user_id_str,
                        },
                      };
                    }
                  })
                  .filter((item: any) => item),
              retweeted_status_result: rtw_result && {
                id: rtw_result.result.legacy.id_str,
                text: rtw_result.result.legacy.full_text,
                user: {
                  id: rtw_result.result.core.user_results.result.rest_id,
                  name: rtw_result.result.core.user_results.result.legacy.name,
                  username:
                    rtw_result.result.core.user_results.result.legacy
                      .screen_name,
                  url: `https://twitter.com/${rtw_result.result.core.user_results.result.legacy.screen_name}`,
                  description:
                    rtw_result.result.core.user_results.result.legacy
                      .description,
                  location:
                    rtw_result.result.core.user_results.result.legacy.location,
                  entities:
                    rtw_result.result.core.user_results.result.legacy.entities,
                  image: {
                    profile:
                      rtw_result.result.core.user_results.result.legacy
                        .profile_image_url_https,
                    banner:
                      rtw_result.result.core.user_results.result.legacy
                        .profile_banner_url,
                  },
                  followers_count:
                    rtw_result.result.core.user_results.result.legacy
                      .followers_count,
                  following_count:
                    rtw_result.result.core.user_results.result.legacy
                      .friends_count,
                  media_count:
                    rtw_result.result.core.user_results.result.legacy
                      .media_count,
                  reply_count:
                    rtw_result.result.core.user_results.result.legacy
                      .reply_count,
                  favourites_count:
                    rtw_result.result.core.user_results.result.legacy
                      .favourites_count,

                  verified:
                    rtw_result.result.core.user_results.result.legacy.verified,
                },
                entities:
                  rtw_result.result.legacy.extended_entities &&
                  rtw_result.result.legacy.extended_entities.media
                    .map((item: any) => {
                      if (item.type === "photo") {
                        return {
                          id: item.id_str,
                          type: item.type,
                          url: item.url,
                          expanded_url: item.expanded_url,
                          media_key: item.media_key,
                          media_url: item.media_url_https,
                          info: {
                            width: item.original_info.width,
                            height: item.original_info.height,
                          },
                          source: item.source_status_id_str && {
                            id:
                              item.source_status_id_str &&
                              item.source_status_id_str,
                            user_id:
                              item.source_user_id_str &&
                              item.source_user_id_str,
                          },
                        };
                      } else if (item.type === "video") {
                        return {
                          id: item.id_str,
                          type: item.type,
                          url: item.url,
                          expanded_url: item.expanded_url,
                          media_key: item.media_key,
                          media_url: item.media_url_https,
                          info: {
                            width: item.original_info.width,
                            height: item.original_info.height,
                          },
                          video: {
                            aspect_ration: item.original_info.aspect_ratio,
                            duration_ms: item.duration_millis,
                            variants: item.video_info.variants
                              .map((item: any) => {
                                if (item.bitrate) {
                                  return {
                                    url: item.url,
                                    content_type: item.content_type,
                                    bitrate: item.bitrate,
                                  };
                                }
                              })
                              .filter((item: any) => item),
                          },
                          source: item.source_status_id_str && {
                            id:
                              item.source_status_id_str &&
                              item.source_status_id_str,
                            user_id:
                              item.source_user_id_str &&
                              item.source_user_id_str,
                          },
                        };
                      }
                    })
                    .filter((item: any) => item),
              },
              views: tw_result.views.count,
              lang: tw_result.legacy.lang,
              reply_count: tw_result.legacy.reply_count,
              retweet_count: tw_result.legacy.retweet_count,
              favorite_count: tw_result.legacy.favorite_count,
              quote_count: tw_result.legacy.quote_count,
              created_at: tw_result.legacy.created_at,
              detail: `/twitter?id=${tw_result.legacy.id_str}&type=tweetDetail`,
            };
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
        cursor: cursor && cursor,
        more_tweets: `/twitter?id=${id}&type=tweet&cursor=${cursor.content.value}`,
        data: tweets.filter((item: any) => item),
      };
    }
    res.status(200).json(response_data);
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ error: e.message || "Internal Server Error" });
  }
});

app.listen(5000, () => console.log(`Server running on port ${5000}`));
