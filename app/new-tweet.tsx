import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

interface Props {}

const newTweet: React.FC<Props> = ({}) => {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    const supabase = createServerActionClient<Database>({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("tweets").insert({ title, user_id: user.id });
    }
  };
  return (
    <form action={addTweet}>
      <input type="text" name="title" />
    </form>
  );
};

export default newTweet;
