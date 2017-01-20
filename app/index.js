import React, {Component} from 'react'
import {
    Dimensions, Image, LayoutAnimation,
    ListView, View, Text, StatusBar, StyleSheet
} from 'react-native'
import {
  Components
} from 'exponent';

import Card from './Card'
import {icons, cities} from './constants'

const {width, height} = Dimensions.get('window')

class App extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {
            dataSource: ds.cloneWithRows(cities),
            count: cities.length
        }
    }

    componentDidMount() {
        StatusBar.setHidden(true)
    }

    render() {
        const {dataSource, count, currentIndex, animating} = this.state
        return (
            <Components.LinearGradient
                colors = {['#7D8185', '#9BAAB5']}
                style = {[styles.scene]}>
                <ListView horizontal pagingEnabled
                    scrollEnabled={!animating}
                    style={{}}
                    onChangeVisibleRows = {this.computeVisible.bind(this)}
                    contentContainerStyle = {{
                        justifyContent: 'center', alignItems: 'center',
                    }}
                    showsHorizontalScrollIndicator = {false}
                    dataSource = {dataSource}
                    renderRow = {this.renderRow}
                />
                <Header />
                <Footer index={currentIndex} count = {count} />
            </Components.LinearGradient>
        )
    }

    renderRow = (rowData: string, sectionID: number, rowID: number) => {
        return  (
            <Card city = {rowData}
                animating = {this.animating.bind(this)}
                />
            )
    }

    animating = (bool) => {
        this.setState({animating: bool})
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

const Header = () => (
    <View style={styles.sceneHeader} >
        <Image source={{uri: icons.magifyIcon}}
            style={styles.headerIcon} />
        <Text style={styles.fontHeader}>
            TOFIND
        </Text>
        <Image source={{uri: icons.crosshairIcon}}
            style={styles.headerIcon} />
    </View>
)

const Footer = ({index, count}) => (
    <View style = {styles.sceneFooter}>
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
    </View>
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
         flex: 6,
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
        backgroundColor: 'transparent', color: 'white', fontSize: 18, fontWeight: '600'
    },
    footerIconsWrapper: {
        flexDirection: 'row', justifyContent: 'space-around',
        width: width, paddingVertical: 5
    },
    footerIcon: {
        width: 22, height: 22, resizeMode: 'contain', tintColor: 'white'
    },
})
