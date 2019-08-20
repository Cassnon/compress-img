import {
  get_string_img_info,
  get_file_img_info,
  get_base64_img_from_array_buffer,
  get_file_from_array_buffer,
  imagedata_to_blob,
  blob_to_arrayBuffer,
  resize_image,
  jpeg_encode,
  quant_process,
  optipng_compress,
  set_path,
} from '@cmao/compress-img';

export async function compress_file(file:File, width:number, height:number, type:'file'|'base64') {
  const info = await get_file_img_info(file);
  let data = info.image_data;
  if (width > 0 && height > 0) {
    data = resize_image(data, {width, height});
  }
  if (info.type === 'image/jpeg') {
    const buffer = await jpeg_encode(data);
    if (type === 'file') {
      const file = await get_file_from_array_buffer(buffer, info.type, 'test.jpeg');
      return file;
    } else {
      const base64 = await get_base64_img_from_array_buffer(buffer, info.type);
      return base64;
    }
  }
  if (info.type === 'image/png') {
    const transparent_imagedata = await quant_process(data);
    const blob = await imagedata_to_blob(transparent_imagedata, info.type);
    const buffer = await blob_to_arrayBuffer(blob);
    const png_buffer = await optipng_compress(buffer);
    if (type === 'file') {
      const file = await get_file_from_array_buffer(png_buffer, info.type, 'test.png');
      return file;
    } else {
      const base64 = await get_base64_img_from_array_buffer(png_buffer, info.type);
      return base64;
    }
  }
}

export async function compress_base64(str:string, width:number, height:number, type:'file'|'base64') {
  const info = await get_string_img_info(str);
  let data = info.image_data;
  if (width > 0 && height > 0) {
    data = resize_image(data, {width, height});
  }
  if (info.type === 'image/jpeg') {
    const buffer = await jpeg_encode(data);
    if (type === 'file') {
      const file = await get_file_from_array_buffer(buffer, info.type, 'test.jpeg');
      return file;
    } else {
      const base64 = await get_base64_img_from_array_buffer(buffer, info.type);
      return base64;
    }
  }
  if (info.type === 'image/png') {
    const transparent_imagedata = await quant_process(data);
    const blob = await imagedata_to_blob(transparent_imagedata, info.type);
    const buffer = await blob_to_arrayBuffer(blob);
    const png_buffer = await optipng_compress(buffer);
    if (type === 'file') {
      const file = await get_file_from_array_buffer(png_buffer, info.type, 'test.jpeg');
      return file;
    } else {
      const base64 = await get_base64_img_from_array_buffer(png_buffer, info.type);
      return base64;
    }
  }
}

export async function file_to_base64(file:File) : Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      }
    };
    reader.readAsDataURL(file);
  });
}

export function set_compress_file_path() {
  set_path('https://dev-ocean.codemao.cn/compress-img/');
}