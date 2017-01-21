import React, {Component} from 'react'
import {
    Animated, Dimensions, Image, LayoutAnimation,
    ListView, View, Text, StatusBar, StyleSheet
} from 'react-native'
import {
  Asset, Components, Font
} from 'exponent';

import Card from './Card'
import {icons, cities} from './constants'

const {width, height} = Dimensions.get('window')

const cacheImages = images => {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  })
}

const cacheFonts = fonts => {
  return fonts.map(font => Font.loadAsync(font));
}


class App extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {
            loaded: false,
            dataSource: ds.cloneWithRows(cities),
            count: cities.length,
            animatedY: new Animated.Value(0)
        }
        this.handleCardAnimation = this.handleCardAnimation.bind(this)
    }

    componentWillMount() {
        StatusBar.setHidden(true)
        this.loadAssetsAsync()
    }

    async loadAssetsAsync() {
        const imageAssets = cacheImages(
            cities.map(city => city.img)
        )
        const fontAssets = cacheFonts([
            {'lato': require('./assets/LatoRegular.ttf')},
            {'lato_light': require('./assets/LatoLight.ttf')},
            {'lato_italic': require('./assets/LatoLightItalic.ttf')}
        ])
        await Promise.all([
            ...imageAssets,
            ...fontAssets,
        ]);
        this.setState({loaded: true})
    }

    render() {
        const {dataSource, count, currentIndex, disableScroll, animatedY, loaded} = this.state
        if (!loaded) return <Components.AppLoading />
        return (
            <Components.LinearGradient
                colors = {['lightslategrey', 'lightsteelblue']}
                style = {[styles.scene]}>
                <ListView horizontal pagingEnabled
                    scrollEnabled={!disableScroll}
                    style={{}}
                    onChangeVisibleRows = {this.computeVisible.bind(this)}
                    contentContainerStyle = {{
                        justifyContent: 'center', alignItems: 'center',
                    }}
                    showsHorizontalScrollIndicator = {false}
                    dataSource = {dataSource}
                    renderRow = {this.renderRow}
                    />
                <Header animatedY = {animatedY} />
                <Footer index={currentIndex} count = {count}
                    animatedY = {animatedY}
                    />
            </Components.LinearGradient>
        )
    }

    renderRow = (rowData: string, sectionID: number, rowID: number) => {
        return  (
            <Card city = {rowData}
                disableScroll = {this.disableScroll.bind(this)}
                animateMain = {this.handleCardAnimation}
                />
            )
    }

    disableScroll = (bool) => {
        this.setState({disableScroll: bool})
    }

    handleCardAnimation = (animated) => {
        const {x, y} = animated
        this.state.animatedY.setValue(y)
    }

    computeVisible = (visibleRows, changedRows) => {
        // TODO: computeVisible is fired twice per swipe with diff data, use only second one...
        let currentIndex = 0
        const visibleIndexes = Object.keys(visibleRows.s1)
        if (visibleIndexes.length === 1) currentIndex = visibleIndexes[0]
        else if (visibleIndexes.length === 2 && visibleIndexes[0] == 0) currentIndex = visibleIndexes[0]
        else currentIndex = visibleIndexes[1]
        this.setState({currentIndex})
    }

}

export default App;

const Header = ({animatedY}) => (
    <View style={styles.sceneHeader} >
        <Image source={{uri: icons.magifyIcon}}
            style={styles.headerIcon} />
        <Animated.Text style={[styles.fontHeader, {
            opacity: animatedY.interpolate({
                inputRange: [-130 ,-100, 0],
                outputRange: [0, 1, 1]
            })
        }]}>
            TOFIND
        </Animated.Text>
        <Image source={{uri: icons.crosshairIcon}}
            style={styles.headerIcon} />
    </View>
)


const Footer = ({index, count, animatedY}) => (
    <Animated.View style = {[styles.sceneFooter, {
        opacity: animatedY.interpolate({
            inputRange: [-130 ,-100, 0],
            outputRange: [0, 1, 1]
            })
        }]}>
        <View style={{paddingBottom: 10}}>
            <Text style={styles.fontFooterCounter}>
                <Text style={{color: '#9297C8'}}>
                    {`${parseInt(index, 10)+1}`}
                </Text>
                <Text>
                    {` / ${count}`}
                </Text>
            </Text>
        </View>
        <View style={styles.footerIconsWrapper}>
            <Image source={{uri: icons.pinIcon}} style={styles.footerIcon}/>
            <Image source={{uri: icons.locationIcon}} style={styles.footerIcon}/>
            <Image source={{uri: icons.userIcon}} style={styles.footerIcon}/>
        </View>
    </Animated.View>
)

const styles = StyleSheet.create({
    scene: {
        flex: 1, alignItems: 'center', justifyContent: 'center'
    },
    sceneHeader: {
        position: 'absolute', top: 0,
        width: width, height: 30, backgroundColor: 'transparent',
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 15, paddingTop: 10
    },
    fontHeader: {
        color: 'white', textAlign: 'center', fontWeight: '600',
        flex: 6, fontFamily: 'lato'
    },
    headerIcon: {
        width: 20, height: 20,
        resizeMode: 'contain', tintColor: 'white'
    },
    sceneFooter: {
        position: 'absolute', bottom: 0, width: width,
        justifyContent: 'center', alignItems: 'center',
        paddingVertical: 10, zIndex: 1
    },
    fontFooterCounter: {
        backgroundColor: 'transparent', color: 'white', fontSize: 18, fontFamily: 'lato'
    },
    footerIconsWrapper: {
        flexDirection: 'row', justifyContent: 'space-around',
        width: width, paddingVertical: 5
    },
    footerIcon: {
        width: 22, height: 22, resizeMode: 'contain', tintColor: 'white'
    },
})
