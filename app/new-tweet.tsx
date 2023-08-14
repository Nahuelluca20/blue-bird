import { cookies } from "next/headers";
import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

interface Props {
  user: User;
}

export const dynamic = "force-dynamic";

const newTweet: React.FC<Props> = ({ user }) => {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    const supabase = createServerActionClient<Database>({ cookies });

    await supabase.from("tweets").insert({ title, user_id: user.id });
  };
  return (
    <form action={addTweet} className="border border-gray-800 border-t-0">
      <div className="flex py-8 px-4">
        <div className="h-12 w-12">
          <Image
            src={user.user_metadata.avatar_url}
            alt="avatar"
            className="rounded-full"
            width={48}
            height={48}
          />
        </div>
        <input
          type="text"
          name="title"
          className="flex-1 bg-inherit ml-2 px-2 text-xl leading-loose placeholder-gray-500"
          placeholder="What is happening?!"
        />
      </div>
    </form>
  );
};

export default newTweet;
