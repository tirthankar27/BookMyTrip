import React,{useEffect} from "react";
import PromoCarousel from "./PromoCarousel";

export default function Home(props) {
  useEffect(() => {
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
      setTimeout(() => {
        props.loadingRef.current.complete();
      }, 10);
    }
  }, [props.loadingRef]);
  return (
    <div>
      <PromoCarousel />
    </div>
  );
}
