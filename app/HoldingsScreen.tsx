import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import axios from "axios";

// Define a type for holdings
interface Holding {
  symbol: string;
  ltp: number;
  quantity: number;
  avgPrice: number;
  close: number;
}

const HoldingsScreen = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const API_URL = "https://json-jvjm.onrender.com/test";
  const [expanded, setExpanded] = useState(false);
  const buttonSize = useSharedValue(1);
  const [isLoading, setIsLoading] = useState(false);

  const calculateTodaysPnl = () => {
    return holdings
      .reduce(
        (total, item) => total + (item.close - item.ltp) * item.quantity,
        0
      )
      .toFixed(2);
  };

  const calculateTotalInvestment = () => {
    return holdings
      .reduce((total, item) => total + item.avgPrice * item.quantity, 0)
      .toFixed(2);
  };

  const calculateCurrentValue = () => {
    return holdings
      .reduce((total, item) => total + item.ltp * item.quantity, 0)
      .toFixed(2);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonSize.value }],
  }));

  const pressed = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();

    const fetchHoldings = async () => {
      try {
        const response = await axios.get(API_URL, {
          signal: controller.signal,
        });
        setHoldings(response.data.userHolding);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching data:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoldings();

    return () => {
      controller.abort();
    };
  }, []);

  const calculateTotalPnl = () => {
    return holdings
      .reduce(
        (total, item) => total + (item.ltp - item.avgPrice) * item.quantity,
        0
      )
      .toFixed(2);
  };

  const renderItem = ({ item }: { item: Holding }) => {
    const totalValue = (item.ltp * item.quantity).toFixed(2);
    const pnl = ((item.ltp - item.avgPrice) * item.quantity).toFixed(2);
    const isProfit = parseFloat(pnl) >= 0;

    return (
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.price}>₹{item.ltp.toFixed(2)}</Text>
        </View>
        <Text style={styles.qty}>Qty: {item.quantity}</Text>
        <Text style={styles.totalValue}>Total Value: ₹{totalValue}</Text>
        <Text style={[styles.pnl, isProfit ? styles.profit : styles.loss]}>
          {isProfit ? "▲" : "▼"} {pnl}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <>
          <Text style={styles.header}>My Holdings</Text>
          <FlatList
            data={holdings}
            renderItem={renderItem}
            keyExtractor={(item) => item.symbol}
          />
          {expanded && (
            <View style={styles.card2}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Current Value:</Text>
                <Text style={styles.value}>₹{calculateCurrentValue()}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Total Investment:</Text>
                <Text style={styles.value}>₹{calculateTotalInvestment()}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Today's P&L:</Text>
                <Text
                  style={[
                    styles.value,
                    parseFloat(calculateTodaysPnl()) >= 0
                      ? styles.profit
                      : styles.negativePnl,
                  ]}
                >
                  ₹{calculateTodaysPnl()}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity onPress={pressed}>
            <Animated.View style={[styles.greenButton, animatedStyle]}>
              <Text style={styles.buttonText}>
                Total P&L: ₹{calculateTotalPnl()}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default HoldingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: Dimensions.get("window").width,
    backgroundColor: "black",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#8000FF",
    textAlign: "center",
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#1c1c1c",

    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  card2: {
    backgroundColor: "lightgray",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  symbol: { fontSize: 16, fontWeight: "bold", color: "white" },
  price: { fontSize: 16, fontWeight: "bold", color: "white" },
  qty: { fontSize: 14, color: "white" },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginTop: 2,
  },
  pnl: { fontSize: 14, fontWeight: "bold", marginTop: 2, color: "white" },
  profit: { color: "green" },
  loss: { color: "red" },
  greenButton: {
    backgroundColor: "#DFFFD6",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "green", fontSize: 16, fontWeight: "bold" },
  label: { fontSize: 16, color: "black" },
  value: { fontSize: 18, fontWeight: "bold", color: "#333" },
  negativePnl: { color: "red" },
});
