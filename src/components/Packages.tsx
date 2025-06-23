import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Gem } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatPrice } from '../lib/utils';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const PACKAGE_KEYS = [
  { key: 'standard', icon: Check, color: 'text-gray-700', bgColor: 'from-gray-200/40 to-gray-100/40' },
  { key: 'silver', icon: Star, color: 'text-yellow-500', bgColor: 'from-yellow-500/20 to-orange-500/20' },
  { key: 'gold', icon: Crown, color: 'text-yellow-700', bgColor: 'from-yellow-200/40 to-orange-100/40' },
  { key: 'diamond', icon: Gem, color: 'text-blue-500', bgColor: 'from-blue-500/20 to-cyan-500/20' },
];

export const Packages: React.FC = () => {
  const [packagesData, setPackagesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'screens'));
      // Use the first Dahisar screen with packages as the source
      const dahisarScreen = snapshot.docs.map(doc => doc.data()).find((s: any) => s.location === 'Dahisar' && s.packages);
      setPackagesData(dahisarScreen?.packages || null);
      setLoading(false);
    };
    fetchPackages();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!packagesData) return <div className="text-center py-20">No package data found.</div>;

  // Helper to get min price for a package
  const getMinPrice = (pkg: any) => {
    const prices: number[] = [];
    if (pkg.weekday) prices.push(...(Object.values(pkg.weekday) as number[]));
    if (pkg.weekend) prices.push(...(Object.values(pkg.weekend) as number[]));
    return Math.min(...prices);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-pink-50/20 to-transparent dark:from-pink-900/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Choose Your Package
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select the perfect package for your romantic movie experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {PACKAGE_KEYS.map((pkgMeta, index) => {
            const pkg = packagesData[pkgMeta.key];
            if (!pkg) return null;
            const minPrice = getMinPrice(pkg);
            return (
              <motion.div
                key={pkgMeta.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className={`h-full text-center bg-gradient-to-br ${pkgMeta.bgColor}`}>
                  <div className="mb-6">
                    <pkgMeta.icon className={`mx-auto ${pkgMeta.color} mb-4`} size={48} />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {pkg.name || pkgMeta.key.charAt(0).toUpperCase() + pkgMeta.key.slice(1)}
                    </h3>
                    <div className="text-base font-semibold text-green-600 mb-1">
                      Starting from ₹{minPrice}
                    </div>
                    <div className="mb-2">
                      {/* Show all prices for info */}
                      {pkg.weekday && Object.entries(pkg.weekday).map(([label, price]: any, i) => (
                        <div key={i} className="text-lg font-semibold text-pink-500">
                          Weekday ({label}): ₹{price}
                        </div>
                      ))}
                      {pkg.weekend && Object.entries(pkg.weekend).map(([label, price]: any, i) => (
                        <div key={i} className="text-lg font-semibold text-pink-500">
                          Weekend ({label}): ₹{price}
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {pkg.persons === 2 ? '2 persons' : 'Up to 4 persons'}
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    {pkg.inclusions && pkg.inclusions.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="text-green-500 mr-3 flex-shrink-0" size={16} />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={'outline'}>
                    Choose {pkg.name || pkgMeta.key.charAt(0).toUpperCase() + pkgMeta.key.slice(1)}
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
        {/* Extra Guest Pricing */}
        {packagesData.extraGuest && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">Additional Guests</h3>
            <ul className="flex flex-wrap gap-6">
              {Object.entries(packagesData.extraGuest).map(([label, price]: any, i) => (
                <li key={i} className="text-gray-700 dark:text-gray-200 text-base">
                  {label} years: <span className="font-semibold text-pink-500">₹{price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Complimentary Hamper */}
        {packagesData.complimentaryHamper && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">Complimentary Hamper <span className="text-xs">(LTD)</span></h3>
            <ul className="flex flex-wrap gap-4">
              {packagesData.complimentaryHamper.map((item: string, i: number) => (
                <li key={i} className="bg-pink-100 dark:bg-pink-900/20 px-3 py-1 rounded-full text-sm text-pink-700 dark:text-pink-200">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Booking Notes */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2">Important Notes</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-200 text-sm">
            <li>We don't provide rented or paid movie on OTT platforms; you can watch free movies/series available.</li>
            <li>Outside food & cake not allowed.</li>
            <li>Non veg food not allowed.</li>
            <li>Smoking & Drinking are not allowed in premises.</li>
            <li>This premises is under CCTV surveillance.</li>
            <li>Once it's booked will not be cancelled or refundable in any condition.</li>
            <li>It's made following all government norms for our security and for guest as well.</li>
            <li>For booking need to pay 50% and send screenshot, confirmation will be sent thereafter.</li>
            <li>If guest is accompanied by kids (below 5yrs) need to pay refundable deposit of 1k on check in.</li>
            <li>500/- for extra 1hr.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};