import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import useS3 from "../hooks/useS3";

type Inputs = {
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

const ConfigForm = () => {
  const { setup, getConfig } = useS3();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = ({
    bucketName,
    region,
    accessKeyId,
    secretAccessKey,
  }) => {
    setup({
      bucketName: bucketName.trim(),
      region: region.trim(),
      accessKeyId: accessKeyId.trim(),
      secretAccessKey: secretAccessKey.trim(),
    });
  };

  useEffect(() => {
    getConfig().then((c) => {
      if (c) {
        setValue("accessKeyId", c.accessKeyId);
        setValue("bucketName", c.bucketName);
        setValue("region", c.region);
        setValue("secretAccessKey", c.secretAccessKey);
      }
    });
  }, [getConfig, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control w-full max-w-md mb-2">
        <label className="label text-lg">
          <span className="label-text">Bucket Name</span>
        </label>
        <input
          type="text"
          className={`input input-bordered w-full text-lg ${
            errors.bucketName ? "input-error" : ""
          }`}
          {...register("bucketName", { required: true })}
        />
      </div>

      <div className="form-control w-full max-w-md mb-2">
        <label className="label text-lg">
          <span className="label-text">Region</span>
        </label>
        <input
          type="text"
          className={`input input-bordered w-full text-lg ${
            errors.region ? "input-error" : ""
          }`}
          {...register("region", { required: true })}
        />
      </div>

      <div className="form-control w-full max-w-md mb-2">
        <label className="label text-lg">
          <span className="label-text">Access Key Id</span>
        </label>
        <input
          type="password"
          className={`input input-bordered w-full text-lg ${
            errors.accessKeyId ? "input-error" : ""
          }`}
          {...register("accessKeyId", { required: true })}
        />
      </div>

      <div className="form-control w-full max-w-md">
        <label className="label text-lg">
          <span className="label-text">Secret Access Key</span>
        </label>
        <input
          type="password"
          className={`input input-bordered w-full text-lg ${
            errors.secretAccessKey ? "input-error" : ""
          }`}
          {...register("secretAccessKey", { required: true })}
        />
      </div>

      <button className="btn text-lg mt-4 mx-auto block w-full">確認</button>
    </form>
  );
};

export default ConfigForm;
