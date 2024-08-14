import { ChangeEvent, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import ImageSvg from "../svgs/ImageSvg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreatePostData, User } from "@/models/interfaces";
import { Link } from "react-router-dom";
import { useToast } from "./ui/use-toast";

const CreatePostTile = () => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery<User>({ queryKey: ["authUser"] });

  const { mutate: createPost, isPending: isLoading } = useMutation({
    mutationFn: async ({ text, img }: CreatePostData) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        const errorMessage =
          (error as Error).message || "Unknown error occurred";

        console.log(error);
        toast({
          variant: "destructive",
          title: `${errorMessage}`,
        });
        throw error;
      }
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post added successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `${error.message}`,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPost({ text, img });
  };

  const handleImageChane = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImg(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="border-b-2 border-dark-gray flex p-3 gap-3">
        <Link to={`profile/${authUser?.username}`}>
          <div className="h-10 w-10 bg-white rounded-full overflow-hidden">
            <img
              className="object-contain"
              src={authUser?.profileImg || "/profile-skeleton.jpg"}
              alt="user-post-image"
            />
          </div>
        </Link>
        <div className="flex flex-col flex-1">
          <textarea
            maxLength={200}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-transparent text-white resize-none mt-2 h-14 outline-none placeholder:text-xl text-xl placeholder:text-secondary-gray"
            placeholder="What is happening?!"
          ></textarea>
          {img && (
            <div className="h-64 mt-3 relative">
              <div
                className="w-7 h-7 absolute bg-black bg-opacity-50 hover:bg-opacity-65 right-1 top-1 rounded-full cursor-pointer text-text-main flex justify-center items-center backdrop-blur-lg"
                onClick={() => {
                  setImg(null);
                  if (imageRef.current) {
                    imageRef.current.value = "";
                  }
                }}
              >
                <AiOutlineClose size={15} />
              </div>
              <img
                src={img}
                alt="selected-image"
                className="h-64 w-full mx-auto rounded-2xl"
              />
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <label
                htmlFor="file"
                className="cursor-pointer hover:bg-twitter-blue/15 rounded-full h-8 w-8 flex justify-center mt-3 items-center"
              >
                <ImageSvg className="fill-twitter-blue h-5" />
              </label>

              <input
                type="file"
                hidden
                id="file"
                accept="image/*"
                ref={imageRef}
                onChange={(e) => handleImageChane(e)}
              />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div
                className={`radial-progress bg-dark-gray text-twitter-blue text-xs ${
                  !text.length ? "hidden" : "block"
                }`}
                style={
                  {
                    "--value": (text.length / 200) * 100,
                    "--thickness": "3px",
                    "--size": "23px",
                  } as React.CSSProperties
                }
                role="progressbar"
              ></div>
              <button
                disabled={(!(text.length > 1) && !img) || isLoading}
                className={`bg-twitter-blue text-white px-5 py-2 flex items-center rounded-full font-semibold text-sm ${
                  (!text.length && !img) || isLoading
                    ? "bg-opacity-50 text-opacity-80"
                    : "hover:bg-opacity-90"
                }`}
              >
                <p>{isLoading ? "Posting" : "Post"}</p>
                {isLoading && (
                  <img src="/loading-icon-white.svg" className="w-5 h-5 ml-1" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreatePostTile;
