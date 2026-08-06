import React, { useState } from "react";
import { HardwareSelection } from "../../types/candidate";
import { LAPTOP_CATALOG, ACCESSORY_CATALOG } from "../../data/mockCandidateData";
import {
  Laptop,
  Truck,
  PackageCheck,
  MapPin,
  CheckCircle2,
  Monitor,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface HardwareSetupStageViewProps {
  hardware: HardwareSelection;
  onUpdateHardware: (updated: Partial<HardwareSelection>) => void;
}

export const HardwareSetupStageView: React.FC<HardwareSetupStageViewProps> = ({
  hardware,
  onUpdateHardware,
}) => {
  const [selectedLaptopId, setSelectedLaptopId] = useState(hardware.selectedLaptopId);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(
    hardware.selectedAccessories || [],
  );
  const [address, setAddress] = useState(hardware.shippingAddress);
  const [deliveryNotes, setDeliveryNotes] = useState(hardware.deliveryInstructions || "");
  const [activeTab, setActiveTab] = useState<"selection" | "tracking" | "setup_guide">("selection");

  const selectedLaptop = LAPTOP_CATALOG.find((l) => l.id === selectedLaptopId);

  const toggleAccessory = (accId: string) => {
    if (selectedAccessories.includes(accId)) {
      setSelectedAccessories(selectedAccessories.filter((id) => id !== accId));
    } else {
      setSelectedAccessories([...selectedAccessories, accId]);
    }
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHardware({
      selectedLaptopId,
      selectedAccessories,
      shippingAddress: address,
      deliveryInstructions: deliveryNotes,
      shipmentStatus: "shipped",
      trackingNumber: "FX-9823-4110-9921",
      carrier: "FedEx Express",
    });
    toast.success("Workstation & Laptop configuration saved! IT provisioning initiated.");
    setActiveTab("tracking");
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-ember/10 text-ember text-xs font-semibold border border-ember/20 flex items-center gap-1">
              <Laptop className="size-3.5" />
              <span>Stage 5 Active · IT Asset Selection</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Carrier: {hardware.carrier || "FedEx Express"}
            </span>
          </div>
          <h2 className="text-2xl font-display font-normal text-foreground mt-1">
            Hardware Setup & Laptop Choice
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure your primary engineering workstation, accessories, and track real-time
            shipment
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-md border border-border">
          <button
            onClick={() => setActiveTab("selection")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "selection"
                ? "bg-ember text-ember-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            1. Laptop & Gear
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "tracking"
                ? "bg-ember text-ember-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            2. Shipment Tracker
          </button>
          <button
            onClick={() => setActiveTab("setup_guide")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "setup_guide"
                ? "bg-ember text-ember-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            3. Unboxing Guide
          </button>
        </div>
      </div>

      {/* TAB 1: Laptop & Accessory Selection */}
      {activeTab === "selection" && (
        <form onSubmit={handleSaveOrder} className="space-y-6">
          {/* Laptop Selection Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-display font-normal text-foreground flex items-center gap-2">
                <Laptop className="size-4 text-ember" />
                <span>Select Your Primary Laptop</span>
              </h3>
              <span className="text-xs text-muted-foreground">
                Included in your IT equipment budget
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LAPTOP_CATALOG.map((laptop) => {
                const isSelected = laptop.id === selectedLaptopId;
                return (
                  <div
                    key={laptop.id}
                    onClick={() => setSelectedLaptopId(laptop.id)}
                    className={`relative rounded-lg p-4 border transition-colors cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-card border-ember ring-1 ring-ember shadow-card"
                        : "bg-card border-border hover:border-accent"
                    }`}
                  >
                    <div>
                      {laptop.badge && (
                        <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full bg-ember/10 text-ember text-[10px] font-semibold border border-ember/20">
                          {laptop.badge}
                        </span>
                      )}

                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={laptop.image}
                          alt={laptop.name}
                          className="size-16 object-cover rounded-md border border-border"
                        />
                        <div>
                          <div className="text-xs font-semibold text-ember">{laptop.brand}</div>
                          <h4 className="text-sm font-semibold text-foreground">{laptop.name}</h4>
                          <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                            {laptop.chip}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-surface p-2.5 rounded-md border border-border font-mono text-muted-foreground mb-3">
                        <div>
                          Memory:{" "}
                          <span className="text-foreground font-semibold">{laptop.ram}</span>
                        </div>
                        <div>
                          Storage:{" "}
                          <span className="text-foreground font-semibold">{laptop.storage}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-[11px] text-muted-foreground">{laptop.specs}</span>
                      <div
                        className={`size-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "bg-ember border-ember text-ember-foreground"
                            : "border-border"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="size-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accessories Selector */}
          <div>
            <h3 className="text-lg font-display font-normal text-foreground mb-3 flex items-center gap-2">
              <Monitor className="size-4 text-ember" />
              <span>Select Workstation Peripherals & Accessories</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ACCESSORY_CATALOG.map((acc) => {
                const isSelected = selectedAccessories.includes(acc.id);
                return (
                  <div
                    key={acc.id}
                    onClick={() => toggleAccessory(acc.id)}
                    className={`p-3.5 rounded-lg border transition-colors cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-card border-ember text-foreground ring-1 ring-ember"
                        : "bg-card border-border hover:border-accent text-muted-foreground"
                    }`}
                  >
                    <div>
                      <img
                        src={acc.image}
                        alt={acc.name}
                        className="w-full h-20 object-cover rounded-md mb-2 border border-border"
                      />
                      <div className="text-[10px] font-semibold text-ember uppercase tracking-wider">
                        {acc.category}
                      </div>
                      <div className="text-xs font-semibold text-foreground mt-0.5">{acc.name}</div>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                        {acc.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-xs">
                      <span
                        className={
                          isSelected ? "text-ember font-semibold" : "text-muted-foreground"
                        }
                      >
                        {isSelected ? "Selected" : "Add to package"}
                      </span>
                      <div
                        className={`size-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "bg-ember border-ember text-ember-foreground"
                            : "border-border"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="size-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address & Instructions Form */}
          <div className="bg-card border border-border rounded-lg p-5 shadow-card space-y-4">
            <h3 className="text-lg font-display font-normal text-foreground flex items-center gap-2">
              <MapPin className="size-4 text-ember" />
              <span>Confirm Courier Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="md:col-span-2">
                <label className="block text-muted-foreground mb-1 font-medium">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-surface border border-border text-foreground focus:outline-none focus:border-ember"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">
                  Apartment / Suite
                </label>
                <input
                  type="text"
                  value={address.apartment || ""}
                  onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-surface border border-border text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-surface border border-border text-foreground focus:outline-none focus:border-ember"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">
                  State / Province
                </label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-surface border border-border text-foreground focus:outline-none focus:border-ember"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">
                  Postal Zip Code
                </label>
                <input
                  type="text"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-surface border border-border text-foreground focus:outline-none focus:border-ember"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-muted-foreground mb-1 font-medium text-xs">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Leave with concierge or front desk reception"
                className="w-full px-3 py-2 rounded-md bg-surface border border-border text-foreground text-xs focus:outline-none focus:border-ember"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-md bg-ember text-ember-foreground font-semibold text-xs shadow-xs hover:bg-ember/90 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <PackageCheck className="size-4" />
              <span>Submit & Request Hardware Dispatch</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Real-time Shipment Logistics Tracker */}
      {activeTab === "tracking" && (
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-lg p-5 shadow-card space-y-5">
            {/* Courier Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-surface rounded-md border border-border gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-md bg-ember text-ember-foreground flex items-center justify-center font-bold">
                  <Truck className="size-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Courier & Logistics
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {hardware.carrier || "FedEx Express"}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    Tracking #: {hardware.trackingNumber || "FX-9823-4110-9921"}
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs text-muted-foreground font-medium">Estimated Arrival</div>
                <div className="text-base font-bold text-success">
                  {hardware.estimatedDeliveryDate || "August 4, 2026"}
                </div>
              </div>
            </div>

            {/* Tracking Steps Timeline */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider">
                Live Package Logistics Status
              </h3>

              <div className="relative border-l-2 border-border ml-3 pl-5 space-y-6">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0 size-5 rounded-full bg-success text-success-foreground flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      Order Confirmed by IT Department
                    </div>
                    <div className="text-[10px] text-muted-foreground">Jul 29, 2026 · 09:30 AM</div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Hardware specs approved: {selectedLaptop?.name || "Equipment Pending"}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0 size-5 rounded-full bg-success text-success-foreground flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      Device Security Provisioning & Pre-Image
                    </div>
                    <div className="text-[10px] text-muted-foreground">Jul 30, 2026 · 02:15 PM</div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      IT team installed corporate security profiles, file encryption, and test
                      certificates.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0 size-5 rounded-full bg-ember text-ember-foreground flex items-center justify-center font-bold text-xs ring-4 ring-ember/20">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ember flex items-center gap-2">
                      <span>Shipped & In Transit via FedEx</span>
                      <span className="px-1.5 py-0.5 bg-ember/10 text-ember text-[9px] rounded-xs font-semibold">
                        ACTIVE
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">Jul 31, 2026 · 08:00 AM</div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Package departed Oakland Sorting Hub. Direct signature required upon delivery.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative opacity-60">
                  <div className="absolute -left-[27px] top-0 size-5 rounded-full bg-surface border border-border text-muted-foreground flex items-center justify-center text-xs">
                    4
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">
                      Out for Local Delivery
                    </div>
                    <div className="text-[10px] text-muted-foreground">Expected Aug 4, 2026</div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative opacity-60">
                  <div className="absolute -left-[27px] top-0 size-5 rounded-full bg-surface border border-border text-muted-foreground flex items-center justify-center text-xs">
                    5
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">
                      Delivered & Ready for Setup
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Destination: {hardware.shippingAddress.city}, {hardware.shippingAddress.state}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Unboxing & Remote IT Setup Guide */}
      {activeTab === "setup_guide" && (
        <div className="bg-card border border-border rounded-lg p-5 shadow-card space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <div className="p-2 bg-surface text-ember rounded-md border border-border">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-normal text-foreground">
                Remote Device Setup Guide
              </h3>
              <p className="text-xs text-muted-foreground">
                Follow these 3 steps when your hardware box arrives at your doorstep
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {hardware.unboxingNotes.map((note, idx) => (
              <div
                key={idx}
                className="p-3 bg-surface rounded-md border border-border flex items-start gap-3"
              >
                <span className="size-5 rounded-full bg-ember text-ember-foreground font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-foreground leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
