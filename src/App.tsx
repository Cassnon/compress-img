import React from 'react';
import { compress_file, compress_base64, file_to_base64, set_compress_file_path } from './compress-img';

interface State {
  input_state:'file'|'base64';
  image_loaded:boolean;
  output_state:'file'|'base64';
}

class App extends React.Component<{}, State> {
  
  private origin_image:HTMLImageElement|undefined = undefined;
  private compress_image:HTMLImageElement|undefined = undefined;
  private textarea:HTMLTextAreaElement|undefined = undefined;
  private file:File|undefined = undefined;
  private fileinput:HTMLInputElement|undefined = undefined;
  private base64:string|undefined = '';
  private height_input:HTMLInputElement|undefined = undefined;
  private width_input:HTMLInputElement|undefined = undefined;

  constructor(props:any) {
    super(props);
    this.show_file = this.show_file.bind(this);
    this.compress = this.compress.bind(this);
    this.reset = this.reset.bind(this);
    this.switch_file_mode = this.switch_file_mode.bind(this);
    this.switch_base64_mode = this.switch_base64_mode.bind(this);
    this.add_base64_file = this.add_base64_file.bind(this);
    this.state = {
      input_state: 'file',
      image_loaded: false,
      output_state: 'file',
    }
  }

  componentDidMount() {
    set_compress_file_path();
  }

  async show_file(e:React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    if (files) {
      const file = files[0];
      this.file = file;
      const base_64 = await file_to_base64(file);
      if (this.origin_image) {
        this.origin_image.src = base_64;
        this.setState({
          image_loaded: true,
        })
      }
    }
  }

  async compress() {
    let h = 0;
    let w = 0;
    if (this.height_input) {
      h = Number(this.height_input.value);
    }
    if (this.width_input) {
      w = Number(this.width_input.value);
    }
    if (this.state.input_state === 'file') {
      if (this.file) {
        const result = await compress_file(this.file, w, h, this.state.output_state);
        if (this.state.output_state === 'base64') {
          if (result && typeof(result) === 'string' && this.compress_image) {
            this.compress_image.src = result;
          }
        } else {
          if (result && this.compress_image) {
            const file = URL.createObjectURL(result); 
            this.compress_image.src = file;
          }
        }
      }
    }
    if (this.state.input_state === 'base64') {
      if (this.base64) {
        const result = await compress_base64(this.base64, w, h, this.state.output_state);
        if (this.state.output_state === 'base64') {
          if (result && typeof(result) === 'string' && this.compress_image) {
            this.compress_image.src = result;
          }
        } else {
          if (result && this.compress_image) {
            const file = URL.createObjectURL(result); 
            this.compress_image.src = file;
          }
        }
      }
    }
  }

  reset() {
    if (this.compress_image) {
      this.compress_image.src = '';
    }
    if (this.origin_image) {
      this.origin_image.src = '';
    }
    if (this.fileinput) {
      this.fileinput.value = '';
    }
    if (this.textarea) {
      this.textarea.value = '';
    }
    if (this.height_input) {
      this.height_input.value = '';
    }
    if (this.width_input) {
      this.width_input.value = '';
    }
    this.file = undefined;
    this.base64 = '';
    this.setState({
      image_loaded: false,
    })
  }
    

  switch_file_mode() {
    if (this.state.input_state === 'file') {
      return;
    }
    this.reset();
    this.setState({
      input_state: 'file',
    });
  }

  switch_base64_mode() {
    if (this.state.input_state === 'base64') {
      return;
    }
    this.reset();
    this.setState({
      input_state: 'base64',
    });
  }

  add_base64_file() {
    if (this.textarea) {
      this.base64 = this.textarea.value;
      if (this.origin_image) {
        this.origin_image.src = this.base64;
        this.setState({
          image_loaded: true,
        })
      }
    }
  }

  output_change(e:any) {
    this.setState({
      output_state: e.target.value
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.switch_file_mode}>文件输入</button>
        <button onClick={this.switch_base64_mode}>base64输入</button>
        <button onClick = { this.reset }>清空</button>
        {
          this.state.input_state === 'file' && 
          <div>
            <label>文件上传</label>  
            <input type="file" onChange = {this.show_file} ref={(ref) => {
              if (!ref) {
                return;
              }
              this.fileinput = ref;
            }}/>
          </div>
        }
        {
          this.state.input_state === 'base64' && 
          <div>
            <label>base64</label>
            <textarea ref={(ref) => {
              if (!ref) {
                return;
              }
              this.textarea = ref;
            }}/>
            <button onClick={this.add_base64_file}>确认添加</button>
          </div>
        }
        {
          this.state.image_loaded &&
            <div>
              <label>高</label><input type="text" ref={(ref) => {
                if (!ref) {
                  return;
                }
                this.height_input = ref;
              }}/>
              <label>宽</label><input type="text" ref={(ref) => {
                if (!ref) {
                  return;
                }
                this.width_input = ref;
              }}/>
              <span>如果宽高都不填就默认不压缩</span>
              <button onClick = { this.compress }>压缩质量</button>
              <label>输出类型</label>
              <select id="output_type" onChange={this.output_change.bind(this)} value={this.state.output_state}>
                <option value="string">base64</option>
                <option value="file">file</option>
              </select>
            </div>
        }
        <div>
          <img alt="原图"
            ref={(ref) => {
              if (!ref) {
                return;
              }
              this.origin_image = ref;
            }}
          />
        </div>
        <div>
          <img alt="处理后"
            ref={(ref) => {
              if (!ref) {
                return;
              }
              this.compress_image = ref;
            }
          }/>
        </div>
      </div>
    )
  }
}

export default App;