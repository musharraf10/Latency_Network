"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/hooks/useStore";
import { exchanges, cloudRegions } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { 
  Plus, 
  MapPin, 
  ArrowRight, 
  Zap, 
  CheckCircle,
  AlertCircle,
  Coins
} from "lucide-react";

interface SelectedPoint {
  id: string;
  name: string;
  type: "exchange" | "region";
  coordinates: [number, number];
  provider?: string;
}

interface CryptoTransaction {
  id: string;
  name: string;
  fromPoint: SelectedPoint;
  toPoint: SelectedPoint;
  estimatedLatency: number;
  status: "active" | "pending" | "completed";
  createdAt: Date;
}

const CryptoTransactionCreator = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"select" | "name" | "confirm">("select");
  const [selectedPoints, setSelectedPoints] = useState<SelectedPoint[]>([]);
  const [cryptoName, setCryptoName] = useState("");
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const resetDialog = useCallback(() => {
    setStep("select");
    setSelectedPoints([]);
    setCryptoName("");
    setIsCreating(false);
  }, []);

  const handlePointSelect = (point: SelectedPoint) => {
    if (selectedPoints.length < 2) {
      setSelectedPoints(prev => [...prev, point]);
      
      if (selectedPoints.length === 1) {
        setStep("name");
      }
    }
  };

  const calculateEstimatedLatency = (from: SelectedPoint, to: SelectedPoint): number => {
    // Simple distance-based latency calculation
    const [lat1, lng1] = from.coordinates;
    const [lat2, lng2] = to.coordinates;
    
    const distance = Math.sqrt(
      Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)
    );
    
    // Convert to approximate latency (simplified)
    return Math.round(distance * 10 + Math.random() * 50 + 20);
  };

  const handleCreateTransaction = async () => {
    if (selectedPoints.length !== 2 || !cryptoName.trim()) return;

    setIsCreating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newTransaction: CryptoTransaction = {
      id: `tx-${Date.now()}`,
      name: cryptoName.trim(),
      fromPoint: selectedPoints[0],
      toPoint: selectedPoints[1],
      estimatedLatency: calculateEstimatedLatency(selectedPoints[0], selectedPoints[1]),
      status: "active",
      createdAt: new Date(),
    };

    setTransactions(prev => [...prev, newTransaction]);
    setStep("confirm");
    setIsCreating(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetDialog, 300);
  };

  const availablePoints: SelectedPoint[] = [
    ...exchanges.map(exchange => ({
      id: exchange.id,
      name: exchange.name,
      type: "exchange" as const,
      coordinates: exchange.coordinates,
    })),
    ...cloudRegions.map(region => ({
      id: region.id,
      name: `${region.provider} ${region.location}`,
      type: "region" as const,
      coordinates: region.coordinates,
      provider: region.provider,
    })),
  ];

  const getPointIcon = (point: SelectedPoint) => {
    if (point.type === "exchange") {
      return <Coins className="w-4 h-4 text-green-400" />;
    }
    return <MapPin className="w-4 h-4 text-blue-400" />;
  };

  const getProviderColor = (provider?: string) => {
    switch (provider) {
      case "AWS": return "bg-orange-500";
      case "GCP": return "bg-blue-500";
      case "Azure": return "bg-cyan-400";
      default: return "bg-green-500";
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Crypto Route
          </Button>
        </DialogTrigger>
        <DialogContent className={`max-w-2xl transition-colors ${
          isDark 
            ? "bg-slate-900 border-slate-700" 
            : "bg-white border-slate-300"
        }`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <Coins className="w-5 h-5 text-green-400" />
              Create Crypto Transaction Route
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {step === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <h3 className={`font-medium mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Select Two Points for Your Route
                  </h3>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Choose a source and destination for your crypto transaction
                  </p>
                </div>

                {/* Selected Points Display */}
                {selectedPoints.length > 0 && (
                  <Card className={`transition-colors ${
                    isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            {getPointIcon(selectedPoints[0])}
                          </div>
                          <div className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                            {selectedPoints[0].name}
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {selectedPoints[0].type}
                          </Badge>
                        </div>
                        
                        {selectedPoints.length === 2 && (
                          <>
                            <ArrowRight className={`w-6 h-6 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                            <div className="text-center">
                              <div className="flex items-center justify-center mb-2">
                                {getPointIcon(selectedPoints[1])}
                              </div>
                              <div className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                                {selectedPoints[1].name}
                              </div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {selectedPoints[1].type}
                              </Badge>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Available Points */}
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {availablePoints
                    .filter(point => !selectedPoints.some(sp => sp.id === point.id))
                    .map((point) => (
                    <Button
                      key={point.id}
                      variant="ghost"
                      className={`w-full justify-start p-3 h-auto transition-colors ${
                        isDark 
                          ? "bg-slate-800/50 hover:bg-slate-700/50" 
                          : "bg-slate-100/50 hover:bg-slate-200/50"
                      }`}
                      onClick={() => handlePointSelect(point)}
                      disabled={selectedPoints.length >= 2}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          {getPointIcon(point)}
                          <div className="text-left">
                            <div className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                              {point.name}
                            </div>
                            <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                              {point.type === "exchange" ? "Crypto Exchange" : "Cloud Region"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {point.provider && (
                            <div className={`w-3 h-3 rounded-full ${getProviderColor(point.provider)}`} />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {point.type}
                          </Badge>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "name" && (
              <motion.div
                key="name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className={`font-medium mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Route Selected Successfully
                  </h3>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Now enter the cryptocurrency name for this transaction route
                  </p>
                </div>

                {/* Route Summary */}
                <Card className={`transition-colors ${
                  isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          {getPointIcon(selectedPoints[0])}
                        </div>
                        <div className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                          {selectedPoints[0].name}
                        </div>
                      </div>
                      
                      <ArrowRight className={`w-6 h-6 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          {getPointIcon(selectedPoints[1])}
                        </div>
                        <div className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                          {selectedPoints[1].name}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Badge variant="outline" className="text-xs">
                        Estimated Latency: {calculateEstimatedLatency(selectedPoints[0], selectedPoints[1])}ms
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Crypto Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="crypto-name" className={isDark ? "text-white" : "text-slate-900"}>
                    Cryptocurrency Name
                  </Label>
                  <Input
                    id="crypto-name"
                    placeholder="e.g., Bitcoin, Ethereum, Solana..."
                    value={cryptoName}
                    onChange={(e) => setCryptoName(e.target.value)}
                    className={`transition-colors ${
                      isDark 
                        ? "bg-slate-800 border-slate-600 text-white" 
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("select")}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateTransaction}
                    disabled={!cryptoName.trim() || isCreating}
                    className="flex-1"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Create Route
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 text-center"
              >
                <div>
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Route Created Successfully!
                  </h3>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Your crypto transaction route has been added to the visualization
                  </p>
                </div>

                <Card className={`transition-colors ${
                  isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <Coins className="w-5 h-5 text-green-400" />
                        <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                          {cryptoName}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {selectedPoints[0].name}
                        </span>
                        <ArrowRight className="w-4 h-4 text-green-400" />
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {selectedPoints[1].name}
                        </span>
                      </div>
                      
                      <Badge variant="default" className="text-xs">
                        Active Route
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleClose} className="w-full">
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Active Transactions Display */}
      {transactions.length > 0 && (
        <div className="mt-4">
          <h4 className={`font-medium mb-2 text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
            Active Crypto Routes ({transactions.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className={`transition-colors ${
                isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-100/50 border-slate-200"
              }`}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-green-400" />
                      <span className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                        {transaction.name}
                      </span>
                    </div>
                    <Badge variant="default" className="text-xs">
                      {transaction.estimatedLatency}ms
                    </Badge>
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {transaction.fromPoint.name} → {transaction.toPoint.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CryptoTransactionCreator;