import { useEffect } from "react";
const AdBanner = (props: any) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      <div className="adsesne bg-white w-full h-28 mt-5 relative">
        <div className="text-center">*****ads ads*****</div>
      </div>

      <ins
        className="adsbygoogle adbanner-customize"
        style={{
          display: "block",
          overflow: "hidden",
        }}
        data-ad-client="ca-pub-1311880021590922"
        {...props}
      />
    </>
  );
};
export default AdBanner;
