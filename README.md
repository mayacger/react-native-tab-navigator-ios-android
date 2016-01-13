# react-native-tab-navigator-ios-android
react-native-tab-navigator ios and android


## navigatorBar tabBar

## 参考

https://github.com/t4t5/react-native-router

https://github.com/Qwikly/react-native-router-redux

https://github.com/exponentjs/react-native-tab-navigator

通过学习以上几个组件整合在了一个组件，非常粗糙，仅供参考。

https://github.com/Creemli/React-Native-Redux-TodoList

## 说明

纯自我学习的使用，不推荐在正式项目使用。bug多少未知，仅仅满足我目前自己的需求，切换tab及路由等。

使用了redux。

```javascript
import  {Router, actions as routerActions} from 'react-native-tab-navigator-ios-android';

const mapStateToProps = state => ({
  router: state.router,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...routerActions,
  }, dispatch),
  dispatch,
});

```

```javascript

let firstRoute = {
      name: 'Home',
      component: Home,
      leftCorner: AddPeople
    };
    
    <Router
          {...this.props}
          firstRoute={firstRoute}
          headerStyle={styles.header}
          backButtonComponent={BackButton}
          rightCorner={SearchAndCompose}
          tabBarStyle={{backgroundColor: '#666'}}
          selectedStyle = {{color:'#f6ba29'}}
        >
        <Router.Tabitem
          renderIcon={() => <Image source={require('../images/add_people_icon.png')} style={styles.icon2}  />}
          renderSelectedIcon={() => <Image source={require('../images/add_people_icon.png')} style={styles.icon2}  />}
          selected={this.state.selectedTab === 'home'}
          onPress={() => this.setState({ selectedTab: 'home' })}
          title="home"
          titleStyle={{color: '#FFF'}}
          changeRoute={{
            name: 'home',
            component: Home,
            leftCorner: AddPeople
          }}
          />
          <Router.Tabitem
            renderIcon={() => <Image source={require('../images/compose_icon.png')} style={styles.icon}  />}
            renderSelectedIcon={() => <Image source={require('../images/compose_icon.png')} style={styles.icon}  />}
            selected={this.state.selectedTab === 'news'}
            onPress={() => this.setState({ selectedTab: 'news' })}
            title="news"
            titleStyle={{color: '#FFF'}}
            changeRoute={{
              name: 'news',
              component: Message2,
              leftCorner: AddPeople
            }}
            />

      </Router>
    
    // export default App;
export default connect(mapStateToProps, mapDispatchToProps)(App);
```
##Navigator Methods

```javascript
//push
this.props.actions.push({
      
      name: '详细内容',
      popTo: {
        name: "详情",
        component: Home,
      },
    });
//pop
this.props.actions.pop();
```

## 参考示例

### ios

### android
