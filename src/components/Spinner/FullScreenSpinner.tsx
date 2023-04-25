import Spinner from "./Spinner";

const FullScreenSpinner = () => {
  return (
    <div className="flex justify-center items-center absolute z-50 top-0 left-0 right-0 bottom-0 bg-[rgb(3,7,18,0.5)]">
      <Spinner />
    </div>
  );
};

export default FullScreenSpinner;
