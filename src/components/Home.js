import React, { useEffect } from "react";
import PromoCarousel from "./PromoCarousel";

export default function Home(props) {
  useEffect(() => {
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
      setTimeout(() => {
        if (props.loadingRef?.current) {
          props.loadingRef.current.complete();
        }
      }, 100);
    }
  }, [props.loadingRef]);
  return (
    <div>
      <PromoCarousel />
    </div>
  );
}
