"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
interface Props {
  tweets: TweetWithAuthor[];
}

const Tweets: React.FC<Props> = ({ tweets }) => {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (currentOptimisticTweets, newTweet) => {
    const newOptimisticTweets = [...currentOptimisticTweets];
    const index = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id
    );

    newOptimisticTweets[index] = newTweet;
    return newOptimisticTweets;
  });

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase.realtime
      .channel("tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return (
    <>
      {tweets ? (
        optimisticTweets.map((tweet) => (
          <div
            key={tweet.id}
            className="border border-gray-800 border-t-0 px-4 py-8 flex "
          >
            <div className="h-12 w-12">
              <Image
                src={tweet.author.avatar_url}
                alt="tweet user avatar"
                className="rounded-full"
                width={48}
                height={48}
              />
            </div>
            <div className="ml-4">
              <p>
                <span className="font-bold">{tweet.author.name}</span>
                <span className="text-sm ml-2 text-gray-400">{tweet.author.username}</span>
              </p>
              <p>{tweet.title}</p>
              <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
            </div>
          </div>
        ))
      ) : (
        <div>Tweets not found</div>
      )}
    </>
  );
};

export default Tweets;
