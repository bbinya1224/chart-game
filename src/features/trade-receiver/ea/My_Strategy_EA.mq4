//+------------------------------------------------------------------+
//|                                              My_Strategy_EA.mq4 |
//|                                    Automated Trading & Reporting  |
//|                                  Based on MACD & MA Crossover     |
//+------------------------------------------------------------------+
#property copyright "Chart Game User"
#property link      "http://localhost:3000"
#property version   "1.00"
#property strict

//+------------------------------------------------------------------+
//| Inputs                                                           |
//+------------------------------------------------------------------+
input string WebhookURL = "http://localhost:3000/api/trades";
input double LotSize = 0.1;
input int    StopLoss = 200;    // Points (0=Disable)
input int    TakeProfit = 400;  // Points (0=Disable)
input int    MagicNumber = 123456;
input int    Slippage = 3;

// Strategy Inputs
input int    FastMA = 12;
input int    SlowMA = 26;
input int    SignalSMA = 9;

//+------------------------------------------------------------------+
//| Global Variables                                                 |
//+------------------------------------------------------------------+
datetime lastBarTime = 0;
int openTickets[]; // Array to track open order tickets

//+------------------------------------------------------------------+
//| Helper: Add Ticket to Tracking                                   |
//+------------------------------------------------------------------+
void AddTicket(int ticket) {
   int size = ArraySize(openTickets);
   ArrayResize(openTickets, size + 1);
   openTickets[size] = ticket;
}

//+------------------------------------------------------------------+
//| Helper: Remove Ticket from Tracking                              |
//+------------------------------------------------------------------+
void RemoveTicket(int ticket) {
   int size = ArraySize(openTickets);
   int newSize = 0;
   int temp[];
   ArrayResize(temp, size);
   
   for(int i=0; i<size; i++) {
      if(openTickets[i] != ticket) {
         temp[newSize] = openTickets[i];
         newSize++;
      }
   }
   ArrayResize(openTickets, newSize);
   for(int i=0; i<newSize; i++) openTickets[i] = temp[i];
}

//+------------------------------------------------------------------+
//| Helper: Check for Closed Orders                                  |
//+------------------------------------------------------------------+
void CheckClosedOrders() {
   int size = ArraySize(openTickets);
   for(int i=size-1; i>=0; i--) {
      int ticket = openTickets[i];
      
      // Check if order is still open
      if(OrderSelect(ticket, SELECT_BY_TICKET)) {
         if(OrderCloseTime() > 0) { // Order is closed
            SendSignal(ticket, "FLAT");
            RemoveTicket(ticket);
         }
      }
   }
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
//| Helper: CharArrayToString                                        |
//+------------------------------------------------------------------+
string CharArrayToString(char &arr[]) {
   string result = "";
   int size = ArraySize(arr);
   for(int i = 0; i < size && arr[i] != 0; i++) result += CharToString(arr[i]);
   return result;
}

//+------------------------------------------------------------------+
//| Send Webhook Signal                                              |
//+------------------------------------------------------------------+
void SendSignal(int ticket, string type) {
   if(!OrderSelect(ticket, SELECT_BY_TICKET)) return;

   string symbol = OrderSymbol();
   string orderType = (OrderType() == OP_BUY) ? "OP_BUY" : "OP_SELL";
   
   // JSON Construction
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
   
   // Add Close Info if FLAT
   if(type == "FLAT") {
      jsonData += "\"close_price\":" + DoubleToString(OrderClosePrice(), Digits) + ",";
      jsonData += "\"close_time\":\"" + TimeToString(OrderCloseTime(), TIME_DATE|TIME_SECONDS) + "\",";
      jsonData += "\"profit\":" + DoubleToString(OrderProfit() + OrderSwap() + OrderCommission(), 2) + ",";
   }
   
   jsonData += "\"magic_number\":" + IntegerToString(MagicNumber) + ",";
   jsonData += "\"comment\":\"AutoTrade\"";
   jsonData += "}";

   char postData[];
   uchar result[];
   string headers = "Content-Type: application/json\r\n";
   StringToCharArray(jsonData, postData, 0, WHOLE_ARRAY, CP_UTF8);
   ArrayResize(postData, ArraySize(postData) - 1);

   int res = WebRequest("POST", WebhookURL, headers, 5000, postData, result, headers);
   
   if(res == 200 || res == 201) Print("Signal Sent: ", type, " Ticket: ", ticket);
   else Print("Signal Failed: ", res, " Error: ", GetLastError());
}

//+------------------------------------------------------------------+
//| OnTick Function                                                  |
//+------------------------------------------------------------------+
void OnTick() {
   // Check for closed orders every tick
   CheckClosedOrders();

   // Run strategy only once per bar
   if(Time[0] == lastBarTime) return;
   lastBarTime = Time[0];

   // 1. Calculate Indicators
   double macdMain = iMACD(NULL, 0, FastMA, SlowMA, SignalSMA, PRICE_CLOSE, MODE_MAIN, 1);
   double macdSignal = iMACD(NULL, 0, FastMA, SlowMA, SignalSMA, PRICE_CLOSE, MODE_SIGNAL, 1);
   double macdMainPrev = iMACD(NULL, 0, FastMA, SlowMA, SignalSMA, PRICE_CLOSE, MODE_MAIN, 2);
   double macdSignalPrev = iMACD(NULL, 0, FastMA, SlowMA, SignalSMA, PRICE_CLOSE, MODE_SIGNAL, 2);

   // 2. Check Signals (Crossover)
   bool buySignal = (macdMainPrev < macdSignalPrev) && (macdMain > macdSignal);
   bool sellSignal = (macdMainPrev > macdSignalPrev) && (macdMain < macdSignal);

   // 3. Execute Trades
   if(buySignal) {
      if(CountOrders(OP_BUY) == 0) { // Only one buy trade at a time
         for(int i=0; i<3; i++) { // Retry up to 3 times
            RefreshRates();
            double ask = NormalizeDouble(Ask, Digits);
            double sl = (StopLoss > 0) ? NormalizeDouble(ask - StopLoss * Point, Digits) : 0;
            double tp = (TakeProfit > 0) ? NormalizeDouble(ask + TakeProfit * Point, Digits) : 0;
            
            int ticket = OrderSend(Symbol(), OP_BUY, LotSize, ask, Slippage, sl, tp, "MACD Buy", MagicNumber, 0, Blue);
            if(ticket > 0) {
               SendSignal(ticket, "OPEN");
               AddTicket(ticket);
               break; // Success
            }
            
            int err = GetLastError();
            if(err == 2 || err == 6 || err == 146) { // Common Error, Invalid Price, Trade Context Busy
               Print("Error ", err, " detected. Retrying...");
               Sleep(500);
               continue;
            } else {
               Print("OrderSend Failed: ", err);
               break; // Critical error
            }
         }
      }
   }
   
   if(sellSignal) {
      if(CountOrders(OP_SELL) == 0) {
         for(int i=0; i<3; i++) { // Retry up to 3 times
            RefreshRates();
            double bid = NormalizeDouble(Bid, Digits);
            double sl = (StopLoss > 0) ? NormalizeDouble(bid + StopLoss * Point, Digits) : 0;
            double tp = (TakeProfit > 0) ? NormalizeDouble(bid - TakeProfit * Point, Digits) : 0;
            
            int ticket = OrderSend(Symbol(), OP_SELL, LotSize, bid, Slippage, sl, tp, "MACD Sell", MagicNumber, 0, Red);
            if(ticket > 0) {
               SendSignal(ticket, "OPEN");
               AddTicket(ticket);
               break; // Success
            }
            
            int err = GetLastError();
            if(err == 2 || err == 6 || err == 146) { // Common Error, Invalid Price, Trade Context Busy
               Print("Error ", err, " detected. Retrying...");
               Sleep(500);
               continue;
            } else {
               Print("OrderSend Failed: ", err);
               break; // Critical error
            }
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Helper: Count Orders                                             |
//+------------------------------------------------------------------+
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
