//+------------------------------------------------------------------+
//|                                           HighRisk_BTC_EA.mq4    |
//|                                    High Risk / High Return       |
//|                                    Bollinger Band Breakout       |
//+------------------------------------------------------------------+
#property copyright "Chart Game User"
#property link      "http://localhost:3000"
#property version   "1.00"
#property strict

//+------------------------------------------------------------------+
//| Inputs                                                           |
//+------------------------------------------------------------------+
input string WebhookURL = "http://localhost:3000/api/trades";
input double Lots = 0.1;
input int    MagicNumber = 777777;
input int    Slippage = 10; // Higher slippage for BTC

// Strategy Inputs (High Risk)
input int    BB_Period = 20;
input double BB_Deviation = 2.0;
input int    ATR_Period = 14;
input double RiskRewardRatio = 3.0; // Aim for 3x return

//+------------------------------------------------------------------+
//| Global Variables                                                 |
//+------------------------------------------------------------------+
datetime lastBarTime = 0;

//+------------------------------------------------------------------+
//| Helper: Send Webhook Signal                                      |
//+------------------------------------------------------------------+
void SendSignal(int ticket, string type) {
   if(!OrderSelect(ticket, SELECT_BY_TICKET)) return;

   string symbol = OrderSymbol();
   string orderType = (OrderType() == OP_BUY) ? "OP_BUY" : "OP_SELL";
   
   string jsonData = "{";
   jsonData += "\"leader_account\":\"" + IntegerToString(AccountNumber()) + "\",";
   jsonData += "\"account_server\":\"" + AccountServer() + "\",";
   jsonData += "\"account_company\":\"" + AccountCompany() + "\",";
   jsonData += "\"signal_type\":\"" + type + "\","; 
   jsonData += "\"ticket\":\"" + IntegerToString(ticket) + "\",";
   jsonData += "\"symbol\":\"" + symbol + "\",";
   jsonData += "\"lots\":" + DoubleToString(OrderLots(), 2) + ",";
   jsonData += "\"open_price\":" + DoubleToString(OrderOpenPrice(), Digits) + ",";
   jsonData += "\"stop_loss\":" + DoubleToString(OrderStopLoss(), Digits) + ",";
   jsonData += "\"take_profit\":" + DoubleToString(OrderTakeProfit(), Digits) + ",";
   jsonData += "\"order_type\":\"" + orderType + "\",";
   jsonData += "\"open_time\":\"" + TimeToString(OrderOpenTime(), TIME_DATE|TIME_SECONDS) + "\",";
   
   // Account Info Snapshot
   jsonData += "\"balance\":" + DoubleToString(AccountBalance(), 2) + ",";
   jsonData += "\"equity\":" + DoubleToString(AccountEquity(), 2) + ",";
   jsonData += "\"margin\":" + DoubleToString(AccountMargin(), 2) + ",";
   jsonData += "\"free_margin\":" + DoubleToString(AccountFreeMargin(), 2) + ",";
   double margin = AccountMargin();
   double marginLevel = (margin > 0) ? (AccountEquity() / margin * 100) : 0;
   jsonData += "\"margin_level\":" + DoubleToString(marginLevel, 2) + ",";
   
   if(type == "FLAT") {
      jsonData += "\"close_price\":" + DoubleToString(OrderClosePrice(), Digits) + ",";
      jsonData += "\"close_time\":\"" + TimeToString(OrderCloseTime(), TIME_DATE|TIME_SECONDS) + "\",";
      jsonData += "\"profit\":" + DoubleToString(OrderProfit() + OrderSwap() + OrderCommission(), 2) + ",";
   }
   
   jsonData += "\"magic_number\":" + IntegerToString(MagicNumber) + ",";
   jsonData += "\"comment\":\"HighRisk_BTC\"";
   jsonData += "}";

   char postData[];
   uchar result[];
   string headers = "Content-Type: application/json\r\n";
   StringToCharArray(jsonData, postData, 0, WHOLE_ARRAY, CP_UTF8);
   ArrayResize(postData, ArraySize(postData) - 1);

   WebRequest("POST", WebhookURL, headers, 5000, postData, result, headers);
}

//+------------------------------------------------------------------+
//| Helper: StringToCharArray                                        |
//+------------------------------------------------------------------+
void StringToCharArray(string str, char &arr[], int maxSize) {
   int len = StringLen(str);
   if(len >= maxSize) len = maxSize - 1;
   for(int i = 0; i < len; i++) arr[i] = (char)StringGetCharacter(str, i);
   arr[len] = 0;
}

//+------------------------------------------------------------------+
//| OnTick Function                                                  |
//+------------------------------------------------------------------+
void OnTick() {
   // Check for closed orders
   for(int i=OrdersHistoryTotal()-1; i>=0; i--) {
      if(OrderSelect(i, SELECT_BY_POS, MODE_HISTORY)) {
         if(OrderMagicNumber() == MagicNumber && StringFind(OrderComment(), "Sent") < 0) {
             // Logic to track sent signals would be needed here to avoid duplicates, 
             // but for simplicity we rely on the webhook receiver to deduplicate by ticket ID.
             SendSignal(OrderTicket(), "FLAT");
         }
      }
   }

   // Run strategy once per bar
   if(Time[0] == lastBarTime) return;
   lastBarTime = Time[0];

   // 1. Calculate Indicators
   double upperBand = iBands(NULL, 0, BB_Period, BB_Deviation, 0, PRICE_CLOSE, MODE_UPPER, 1);
   double lowerBand = iBands(NULL, 0, BB_Period, BB_Deviation, 0, PRICE_CLOSE, MODE_LOWER, 1);
   double close = iClose(NULL, 0, 1);
   double atr = iATR(NULL, 0, ATR_Period, 1);

   // 2. Check Signals (Breakout)
   bool buySignal = close > upperBand;
   bool sellSignal = close < lowerBand;

   // 3. Execute Trades
   if(buySignal) {
      if(CountOrders(OP_BUY) == 0) {
         RefreshRates();
         double sl = NormalizeDouble(Ask - (atr * 2.0), Digits); // SL = 2 * ATR
         double tp = NormalizeDouble(Ask + (atr * 2.0 * RiskRewardRatio), Digits); // TP = SL * Ratio
         
         // Check minimum stop level
         double minStop = MarketInfo(Symbol(), MODE_STOPLEVEL) * Point;
         if(Ask - sl < minStop) sl = Ask - minStop;
         
         int ticket = OrderSend(Symbol(), OP_BUY, Lots, Ask, Slippage, sl, tp, "BTC Breakout", MagicNumber, 0, Blue);
         if(ticket > 0) SendSignal(ticket, "OPEN");
         else Print("OrderSend Failed: ", GetLastError());
      }
   }
   
   if(sellSignal) {
      if(CountOrders(OP_SELL) == 0) {
         RefreshRates();
         double sl = NormalizeDouble(Bid + (atr * 2.0), Digits);
         double tp = NormalizeDouble(Bid - (atr * 2.0 * RiskRewardRatio), Digits);
         
         double minStop = MarketInfo(Symbol(), MODE_STOPLEVEL) * Point;
         if(sl - Bid < minStop) sl = Bid + minStop;

         int ticket = OrderSend(Symbol(), OP_SELL, Lots, Bid, Slippage, sl, tp, "BTC Breakout", MagicNumber, 0, Red);
         if(ticket > 0) SendSignal(ticket, "OPEN");
         else Print("OrderSend Failed: ", GetLastError());
      }
   }
}

int CountOrders(int type) {
   int count = 0;
   for(int i = 0; i < OrdersTotal(); i++) {
      if(OrderSelect(i, SELECT_BY_POS, MODE_TRADES)) {
         if(OrderSymbol() == Symbol() && OrderMagicNumber() == MagicNumber && OrderType() == type)
            count++;
      }
   }
   return count;
}
