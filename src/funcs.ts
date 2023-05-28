export function baseTweet(tw: any): any {
  if (tw.__typename === "TweetTombstone") {
    return {
      type: tw.__typename,
      text: tw.tombstone.text,
    };
  }
  return {
    type: tw.__typename,
    id: tw.rest_id,
    text: tw.legacy.full_text,
    note_text: tw.note_tweet && tw.note_tweet.note_tweet_results.result.text,
    user: user(tw.core.user_results.result),
    entities: tw.legacy.entities && tw.legacy.entities,
    extended_entities:
      tw.legacy.extended_entities &&
      entities(tw.legacy.extended_entities.media),
    retweeted_status_result:
      tw.legacy.retweeted_status_result &&
      rtweet_result(tw.legacy.retweeted_status_result),
    quoted_tweet:
      tw.quoted_status_result && baseTweet(tw.quoted_status_result.result),
    views: tw.views.count,
    lang: tw.legacy.lang,
    reply_count: tw.legacy.reply_count,
    retweet_count: tw.legacy.retweet_count,
    favorite_count: tw.legacy.favorite_count,
    quote_count: tw.legacy.quote_count,
    created_at: tw.legacy.created_at,
    detail: `/twitter?id=${tw.rest_id}&type=tweetDetail`,
  };
}

export function tweet(item: any) {
  const tw_result = item.content.itemContent.tweet_results.result;
  const tw_user =
    item.content.itemContent.tweet_results.result.core.user_results.result;
  const rtw_result = tw_result.legacy.retweeted_status_result;
  return {
    id: tw_result.legacy.id_str,
    entryId: item.entryId,
    display: item.content.itemContent.tweetDisplayType,
    url: `https://twitter.com/${tw_user.legacy.screen_name}/status/${tw_result.legacy.id_str}`,
    text: tw_result.legacy.full_text,
    note_text:
      tw_result.note_tweet &&
      tw_result.note_tweet.note_tweet_results.result.text,
    card: tw_result.card && tw_result.card,
    quoted_tweet:
      tw_result.quoted_status_result &&
      baseTweet(tw_result.quoted_status_result.result),
    user: user(tw_user),
    entities: tw_result.legacy.entities && tw_result.legacy.entities,
    extended_entities:
      tw_result.legacy.extended_entities &&
      entities(tw_result.legacy.extended_entities.media),
    retweeted_status_result: rtw_result && rtweet_result(rtw_result),
    views: tw_result.views.count,
    lang: tw_result.legacy.lang,
    reply_count: tw_result.legacy.reply_count,
    retweet_count: tw_result.legacy.retweet_count,
    favorite_count: tw_result.legacy.favorite_count,
    quote_count: tw_result.legacy.quote_count,
    created_at: tw_result.legacy.created_at,
  };
}

export function tweetThread(item: any) {
  return item.content.items
    .map((item: any) => {
      if (
        !item.entryId.includes("cursor") &&
        item.item.itemContent.itemType === "TimelineTweet"
      ) {
        const tw_result = item.item.itemContent.tweet_results.result;
        const tw_user =
          item.item.itemContent.tweet_results.result.core.user_results.result;
        const rtw_result = tw_result.legacy.retweeted_status_result;
        return {
          id: tw_result.legacy.id_str,
          entryId: item.entryId,
          display: item.item.itemContent.tweetDisplayType,
          url: `https://twitter.com/${tw_user.legacy.screen_name}/status/${tw_result.legacy.id_str}`,
          text: tw_result.legacy.full_text,
          note_text:
            tw_result.note_tweet &&
            tw_result.note_tweet.note_tweet_results.result.text,
          card: tw_result.card && tw_result.card,
          quoted_tweet:
            tw_result.quoted_status_result &&
            baseTweet(tw_result.quoted_status_result.result),
          user: user(tw_user),
          entities: tw_result.legacy.entities && tw_result.legacy.entities,
          extended_entities:
            tw_result.legacy.extended_entities &&
            entities(tw_result.legacy.extended_entities.media),
          retweeted_status_result: rtw_result && rtweet_result(rtw_result),
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
}

export function search(item: any) {
  return {
    id: item.id,
    id_str: item.id_str,
    name: item.name,
    username: item.screen_name,
    detail: `/twitter?id=${item.id_str}&type=user`,
    tweets: `/twitter?id=${item.id_str}&type=tweet`,
    image: {
      profile: item.profile_image_url_https,
    },
    location: item.location,

    blue_verified: item.ext_is_blue_verified,
    verified: item.verified,
  };
}

function entities(item: any) {
  return item
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
            id: item.source_status_id_str && item.source_status_id_str,
            user_id: item.source_user_id_str && item.source_user_id_str,
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
            id: item.source_status_id_str && item.source_status_id_str,
            user_id: item.source_user_id_str && item.source_user_id_str,
          },
        };
      } else if (item.type === "animated_gif") {
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
            aspect_ration: item.video_info.aspect_ratio,
            variants: item.video_info.variants
              .map((item: any) => {
                return {
                  url: item.url,
                  content_type: item.content_type,
                  bitrate: item.bitrate,
                };
              })
              .filter((item: any) => item),
          },
          source: item.source_status_id_str && {
            id: item.source_status_id_str && item.source_status_id_str,
            user_id: item.source_user_id_str && item.source_user_id_str,
          },
        };
      }
    })
    .filter((item: any) => item);
}

function rtweet_result(rtw_result: any) {
  return baseTweet(rtw_result.result);
}

export function user(user: any) {
  return {
    id: user.rest_id,
    name: user.legacy.name,
    username: user.legacy.screen_name,
    url: `https://twitter.com/${user.legacy.screen_name}`,
    description: user.legacy.description,
    location: user.legacy.location,
    entities: user.legacy.entities,
    image: {
      profile:
        user.legacy.profile_image_url_https &&
        user.legacy.profile_image_url_https,
      banner: user.legacy.profile_banner_url && user.legacy.profile_banner_url,
    },
    followers_count: user.legacy.followers_count,
    following_count: user.legacy.friends_count,
    media_count: user.legacy.media_count,
    favourites_count: user.legacy.favourites_count,
    default_profile: user.legacy.default_profile,
    professional: user.professional && user.professional,
    extended_profile_info:
      user.legacy_extended_profile && user.legacy_extended_profile,
    blue_verified: user.is_blue_verified,
    verified: user.legacy.verified,
    created_at: user.legacy.created_at,
    tweets: `/twitter?id=${user.rest_id}&type=tweet`,
  };
}

export async function getGuestToken(bearer_token: string) {
  try {
    let headers = {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "accept-encoding": "gzip",
      "accept-language": "en-US,en;q=0.5",
      "Content-Type": "application/json",
      connection: "keep-alive",
      authorization: bearer_token,
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
