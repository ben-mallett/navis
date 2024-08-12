'use client';

export type VideoStreamProps = {
    deviceIP: string;
};

export default function VideoStream(props: VideoStreamProps) {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <img
                src={`http://${props.deviceIP}:19991/stream`}
                alt="Video Stream"
                style={{ width: '512px', height: '288px' }}
            />
        </div>
    );
}
