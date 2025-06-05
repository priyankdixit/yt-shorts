"use client";
import type { Prisma } from "@prisma/client";
import React from "react";
import { Card, CardFooter } from "../ui/card";
import { IKVideo, ImageKitProvider } from "imagekitio-next";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT as string;
console.log("url end point -> ", urlEndPoint);

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
  console.log(short);

  return (
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

      {/* Channel Information  */}
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
            </div>
          </div>

          <div className="text-sm mt-2">
            <p>{short.description}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShortCard;
