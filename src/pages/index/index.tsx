import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import { wxml, style } from './demo'

import './index.scss'

type PageStateProps = {
  counterStore: {
    counter: number,
    increment: Function,
    decrement: Function,
    incrementAsync: Function
  }
}

interface Index {
  props: PageStateProps;
}

@inject('counterStore')
@observer
class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页',
    "usingComponents": {
      "wxml-to-canvas": "../../components/wxml2canvas/src/index",
    }
  }

  componentWillMount() {
    setTimeout(() => {
      this.initCanvas()
    }, 0);
  }

  componentWillReact() {
    console.log('componentWillReact')
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  widget
  initCanvas = () => {
    const widget = this.$scope.selectComponent('.widget')
    this.widget = widget
  }
  container
  toCanvas() {
    const p1 = this.widget.renderToCanvas({ wxml, style })
    p1.then((res) => {
      this.container = res
      this.extraImage()
    })
  }

  extraImage() {
    const p2 = this.widget.canvasToTempFilePath()
    p2.then(res => {
      // this.$scope.setData({
      //   src: res.tempFilePath,
      //   width: this.container.layoutBox.width,
      //   height: this.container.layoutBox.height
      // })
      console.log(res);

      Taro.saveImageToPhotosAlbum({ filePath: res.tempFilePath }).then(res => {
        console.log(res);

      }).catch(err => {
        console.log(err);

      })
    })
  }

  render() {
    return (
      <View className='index'>
        <Button onClick={this.toCanvas}>渲染</Button>
        <Button onClick={this.extraImage}>导出</Button>
        <wxml-to-canvas class="widget"></wxml-to-canvas>
      </View>
    )
  }
}

export default Index as ComponentType
