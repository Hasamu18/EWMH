import { Spin } from "antd";

function Loader() {
  return <div className="flex justify-center">Loading</div>;
}

function LoaderFullScreen({ spinning = true, percent }: LoaderProps) {
  return <Spin spinning={spinning} percent={percent} fullscreen />;
}

Loader.FullScreen = LoaderFullScreen;

export { Loader };

type LoaderProps = {
  spinning?: boolean;
  percent?: number;
};
