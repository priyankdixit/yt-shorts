"use client";

import React, { useEffect } from "react";
import type { Prisma } from "@prisma/client";
import { Card, CardFooter } from "../ui/card";
import { IKVideo, ImageKitProvider } from "imagekitio-next";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ShortComments from "../ShortComments";

const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT as string;

type ShortCardProps = {
  short: Prisma.ShortsGetPayload<{
    include: {
      user: {
        select: {
          name: true;
          email: true;
        };
      };
    };
  }>;
};

const ShortCard: React.FC<ShortCardProps> = ({ short }) => {
  useEffect(() => {
    async function trackView() {
      try {
        const res = await fetch(`/api/shorts/${short.id}/views`, {
          method: "POST",
        });
        if (!res.ok) {
          console.error("Failed to track view");
        }
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    }

    trackView();
  }, [short.id]);

  return (
    <div className="flex max-w-[900px] mx-auto gap-6 p-4">
      {/* Video card */}
      <Card className="p-0 w-[360px] h-[640px] flex flex-col items-center justify-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
        <ImageKitProvider urlEndpoint={urlEndPoint}>
          <IKVideo
            path={short.url.replace(urlEndPoint, "")}
            transformation={[{ height: "640", width: "360", format: "mp4" }]}
            controls
            autoPlay={false}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </ImageKitProvider>

        {/* Channel Information */}
        <CardFooter className="absolute bottom-20 -left-2 text-white">
          <div>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="" alt="channel owner photo" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h3 className="font-semibold">{short.title}</h3>
                <span className="text-sm">{short.user.name}</span>
                <span className="text-sm text-gray-300">{short.viewsCount} views</span>
              </div>
            </div>

            <div className="text-sm mt-2">
              <p>{short.description}</p>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Comments panel */}
      <div className="flex-1 max-h-[640px] overflow-y-auto border border-gray-300 rounded-md p-4">
        <ShortComments shortId={short.id} />
      </div>
    </div>
  );
};

export default ShortCard;
