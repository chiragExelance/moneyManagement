import React, {useState} from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDrawerStatus} from '@react-navigation/drawer';
import {icons, colors, string, fontSize, hp, wp} from '../../helper/index';
import {
  Header,
  Shadow,
  LoginModal,
  RoundButton,
  DetailsModal,
  AddExpenseModal,
} from '../../components/index';
import MonthYearPicker from '../../components/common/MonthYearPicker';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {deleteData} from '../../redux/action/Action';

const Home = () => {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const {navigate, openDrawer} = useNavigation();
  const userData = useSelector(state => state?.data?.userData);
  const dispatch = useDispatch();

  console.log('userData ======> ', userData);

  const today = moment(new Date()).format('DD/MM/YYYY');

  console.log('today', today);

  const [elementId, setElementId] = useState();
  const [showBox, setShowBox] = useState(false);
  const [isMonth, setIsMonth] = useState(false);
  const [calender, setCalender] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [month, setMonth] = useState(
    moment().month(new Date().getMonth()).format('MMM'),
  );

  const handleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };
  const handleDetailsModal = item => {
    setDetailsModal(!detailsModal);
    setElementId(item?.id);
  };
  const handleExpenseModal = () => {
    setShowExpenseModal(!showExpenseModal);
  };
  const handleCalender = () => {
    setCalender(!calender);
  };

  const expenseArray = userData?.filter(obj => {
    if (obj?.category === 'expense') {
      return obj;
    }
  });
  const incomeArray = userData?.filter(obj => {
    if (obj?.category === 'income') {
      return obj;
    }
  });

  const expenseTotal = expenseArray?.reduce((acc, value) => {
    return acc + Number(value.calculatedNumber);
  }, 0);

  const incomeTotal = incomeArray?.reduce((acc, value) => {
    return acc + Number(value.calculatedNumber);
  }, 0);

  const listFooterComponent = () => {
    return <View style={styles.listFooterStyle} />;
  };

  const noDataFoundComponent = () => {
    return (
      <View style={styles.noDataView}>
        <Image source={icons.noData} style={styles.noDataImage} />
        <Text style={styles.noDataText}>{string.noData}</Text>
      </View>
    );
  };

  const onDeletePress = () => {
    return Alert.alert(
      'Are your sure?',
      'Are you sure you want to delete this data?',
      [
        {
          text: 'Yes',
          onPress: () => {
            dispatch(deleteData(elementId));
            setShowBox(false);
            setDetailsModal(false);
          },
        },
        {
          text: 'No',
          onPress: () => {
            setShowBox(false);
          },
        },
      ],
    );
  };

  const sortByDate = userData?.sort((a, b) => {
    return (
      moment(b.selectedDate).format(`YYYY-MM-DD`) -
      moment(a.selectedDate).format(`YYYY-MM-DD`)
    );
  });

  const sortedByDate = userData?.sort(
    (a, b) =>
      Date.parse(new Date(b.selectedDate.split('/').reverse().join('-'))) -
      Date.parse(new Date(a.selectedDate.split('/').reverse().join('-'))),
  );

  console.log('sortByDate....', sortedByDate);

  const sortingData = Object?.values(
    sortedByDate?.reduce((acc, item) => {
      if (!acc[moment(item?.selectedDate).format(`DD-MM-YYYY`)]) {
        acc[moment(item?.selectedDate).format(`DD-MM-YYYY`)] = {
          title: item?.selectedDate,
          data: [],
        };
      }
      acc[moment(item.selectedDate).format(`DD-MM-YYYY`)]?.data.push(item);
      return acc || [];
    }, {}),
  );
  console.log('sortingData....', sortingData);

  const renderData = ({item}) => {
    console.log('item in renderData', item);
    return (
      <Shadow>
        <View style={styles.listBoxItem}>
          <View style={styles.boxTitleView}>
            <Text style={styles.boxHeaderText}>
              {moment(item.title).format(`DD/MM/YYYY`)}
            </Text>
            <View style={styles.boxTitleSubView}>
              {/* <Text style={styles.boxHeaderText}>{'Income:'}</Text>
              <Text style={styles.boxHeaderText}>{'Expenses:'}</Text> */}
            </View>
          </View>
          {item?.data?.map((obj, index) => (
            <TouchableOpacity onPress={() => handleDetailsModal(obj)}>
              <View style={styles.listItemView}>
                <Text style={{color: colors.black}}>{obj?.element}</Text>
                <Text
                  style={{
                    color:
                      obj?.category == 'income'
                        ? colors.incomeGreen
                        : colors.expenseRed,
                  }}>
                  {obj?.category === 'income'
                    ? obj?.calculatedNumber
                    : '-' + obj?.calculatedNumber}
                </Text>
              </View>
              {index + 1 != item.data.length ? (
                <View style={styles.itemSeperatorView} />
              ) : (
                <View style={{height: hp(0.5)}} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Shadow>
    );
  };

  return (
    <View style={styles.container}>
      <RoundButton onPress={handleExpenseModal} />
      <SafeAreaView />
      <Header
        isDate
        isCalendar={calender}
        leftSource={icons.menu}
        rightSource={icons.refresh}
        onDownPress={handleCalender}
        onLeftPress={() => openDrawer()}
        title={isMonth ? `${month?.name} ${year}` : `${month} ${year}`}
      />

      <Shadow>
        <View style={styles.subView}>
          <TouchableOpacity style={styles.btnView}>
            <Text style={styles.mainText}>{string.income}</Text>
            <Text style={styles.numberText}>{incomeTotal}</Text>
          </TouchableOpacity>
          <View style={styles.verticleSeperator} />
          <TouchableOpacity style={styles.btnView}>
            <Text style={styles.mainText}>{string.expenses}</Text>
            <Text style={styles.numberText}>{expenseTotal}</Text>
          </TouchableOpacity>
          <View style={styles.verticleSeperator} />
          <TouchableOpacity style={styles.btnView}>
            <Text style={styles.mainText}>{string.balance}</Text>
            <Text style={styles.numberText}>{incomeTotal - expenseTotal}</Text>
          </TouchableOpacity>
        </View>
      </Shadow>
      <Shadow>
        <TouchableOpacity style={styles.warningView} onPress={handleLoginModal}>
          <Image source={icons.warning} style={styles.warnIcon} />
          <Text style={styles.warnText}>{string.warnText}</Text>
        </TouchableOpacity>
      </Shadow>

      <FlatList
        key={item => item.id}
        bounces={false}
        data={sortingData}
        renderItem={renderData}
        keyExtractor={item => item?.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={listFooterComponent}
        ListEmptyComponent={noDataFoundComponent}
      />

      {calender && (
        <MonthYearPicker
          onChangeYear={text => setYear(text)}
          onChangeMonth={text => {
            setMonth(text);
            setIsMonth(true);
            handleCalender();
          }}
        />
      )}
      <AddExpenseModal
        isVisible={showExpenseModal}
        onBackPress={() => handleExpenseModal()}
        onRequestClose={handleExpenseModal}
        month={isMonth ? month?.name : month}
        year={year}
      />
      <LoginModal isVisible={showLoginModal} onClosePress={handleLoginModal} />
      <DetailsModal
        isVisible={detailsModal}
        onBackPress={handleDetailsModal}
        userDetailId={elementId}
        onDeletePress={() => onDeletePress()}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  subView: {
    height: hp(12),
    borderRadius: 5,
    margin: wp(2.67),
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: wp(0.2),
    backgroundColor: colors.white,
    borderColor: colors.lightgrey,
  },
  verticleSeperator: {
    height: hp(3),
    width: wp(0.1),
    backgroundColor: colors.black,
  },
  boxTitleSubView: {
    flexDirection: 'row',
  },
  mainText: {
    color: colors.black,
    fontSize: fontSize(13),
  },
  numberText: {
    marginTop: hp(1),
    color: colors.black,
    fontSize: fontSize(20),
  },
  btnView: {
    flex: 1,
    alignItems: 'center',
  },
  listBoxItem: {
    marginTop: hp(1.5),
    borderWidth: wp(0.2),
    marginHorizontal: wp(2.67),
    borderColor: colors.lightgrey,
    backgroundColor: colors.white,
  },
  boxTitleView: {
    flexDirection: 'row',
    paddingVertical: hp(0.6),
    borderBottomWidth: wp(0.1),
    paddingHorizontal: wp(2.66),
    borderBottomColor: colors.grey,
    justifyContent: 'space-between',
  },
  listItemView: {
    padding: wp(2.66),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  warningView: {
    padding: wp(2),
    borderRadius: 5,
    margin: wp(2.67),
    flexDirection: 'row',
    borderWidth: wp(0.2),
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: colors.lightgrey,
    backgroundColor: colors.warnBg,
  },
  warnIcon: {
    width: wp(4),
    height: wp(4),
    resizeMode: 'contain',
    tintColor: colors.warnText,
  },
  warnText: {
    marginLeft: wp(1.5),
    color: colors.warnText,
    fontSize: fontSize(12),
  },
  SeperatorView: {
    width: '100%',
    borderWidth: wp(0.05),
    borderColor: colors.grey,
  },
  itemSeperatorView: {
    width: '100%',
    // marginLeft: wp(5),
    borderWidth: wp(0.05),
    borderColor: colors.lightgrey,
  },
  boxHeaderText: {
    color: colors.grey,
    fontSize: fontSize(11),
  },
  listFooterStyle: {
    height: hp(12.5),
  },
  noDataView: {
    marginTop: hp(12),
    alignItems: 'center',
  },
  noDataImage: {
    width: wp(33),
    height: wp(33),
    resizeMode: 'contain',
    tintColor: colors.grey,
  },
  noDataText: {
    color: colors.grey,
    marginTop: hp(1.23),
    fontSize: fontSize(18),
  },
});
