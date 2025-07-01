import React from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'; // If you're using shadcn
import { Button } from '@/components/ui/button';

const StallMenuDrawer = ({ stall }) => {
  return (
    <Dialog>
  <DialogTrigger asChild>
    <Button className="bg-gradient-to-r from-red-500 to-yellow-400 hover:from-red-600 hover:to-yellow-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all">
      View Menu 🍽️
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-md bg-white shadow-2xl rounded-2xl p-6 border border-gray-200">
    <h2 className="text-2xl font-bold text-red-600 mb-4 text-center underline underline-offset-4">
      {stall.stallName} Menu
    </h2>

    {stall.menu.length > 0 ? (
      <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {stall.menu.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r  transition-all shadow"
          >
            <span className="font-medium text-gray-800">{item.name}</span>
            <span className="text-red-600 font-bold text-lg">₹{item.price}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-center text-gray-500">No items in the menu.</p>
    )}
  </DialogContent>
</Dialog>

  );
};

export default StallMenuDrawer;
