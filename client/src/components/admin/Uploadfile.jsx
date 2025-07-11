import React, { useState } from "react";
import { toast } from "react-toastify";
import Resize from "react-image-file-resizer";
import { removeFiles, uploadFiles } from "../../api/product";
import useEcomStore from "../../store/ecom-store";

const Uploadfile = ({ form, setForm }) => {
  const token = useEcomStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);
  const handleOnChange = (e) => {
    // code
    const files = e.target.files;
    if (files) {
      setIsLoading(true);
      let allFiles = form.images; // [] empty array
      for (let i = 0; i < files.length; i++) {
        // console.log(files[i]);

        // Validate
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          toast.error(`File ${file.name} not image`);
          continue;
        }
        // Image Resize
        Resize.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (data) => {
            // endpoint backend
            uploadFiles(token, data)
              .then((res) => {
                console.log(res);
                allFiles.push(res.data);
                setForm({
                  ...form,
                  images: allFiles,
                });
                toast.success("Upload image Success!!!");
              })
              .catch((err) => {
                console.log(err);
              });
          },
          "base64"
        );
      }
    }
  };
  console.log(form);

  const handleDelete = (public_id) => {
    const images = form.images;
    removeFiles(token, public_id)
      .then((res) => {
        const filterImages = images.filter((item) => {
          console.log(item);
          return item.public_id !== public_id;
        });

        console.log("filterImages", filterImages);
        setForm({
          ...form,
          images: filterImages,
        });
        toast.error(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="my-4">
      <div className="flex mx-4 gap-4 my-4">
        {/* image */}
        {form.images.map((item, index) => (
          <div className="relative" key={index}>
            <img className="w-24 h-24 hover:scale-105" src={item.url} />
            <span
              onClick={() => handleDelete(item.public_id)}
              className="absolute top-0 right-0 bg-red-500 p-1 rounded-md"
            >
              X
            </span>
          </div>
        ))}
      </div>

      <div>
        <input onChange={handleOnChange} type="file" name="images" multiple />
      </div>
    </div>
  );
};

export default Uploadfile;
