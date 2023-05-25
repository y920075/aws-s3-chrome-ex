import signCompleteSvg from "src/images/OutlineSignComplete.svg";
import signWrongSvg from "src/images/OutlineSignWrong.svg";

type HistoryCardProps = {
  s3Url: string;
  status: boolean;
  fileKey: string;
  requestId: string;
};

const HistoryCard: React.FC<HistoryCardProps> = ({
  requestId,
  fileKey,
  status,
  s3Url,
}) => {
  return (
    <div className="bg-gray-200 shadow-md rounded-md p-4">
      <div className="flex items-center mb-2">
        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2">
          {status ? (
            <img src={signCompleteSvg} alt="" />
          ) : (
            <img src={signWrongSvg} alt="" />
          )}
        </div>
        <h2 className="text-lg font-semibold">
          Request ID: <span className="text-gray-800">{requestId}</span>
        </h2>
      </div>
      <div className="mb-2">
        <p className="text-gray-700">File Key: {fileKey}</p>
      </div>
      <div>
        <a
          href={s3Url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View File
        </a>
      </div>
    </div>
  );
};

export default HistoryCard;
