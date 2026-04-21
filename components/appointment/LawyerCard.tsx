'use client';

import { Star, MapPin, Award, FileText, Calendar, User, Scale, CheckCircle } from 'lucide-react';

interface LawyerCardProps {
  lawyer: any; 
  onBook: (lawyerId: string) => void;
}

export default function LawyerCard({ lawyer, onBook }: LawyerCardProps) {
  const lawyerId = lawyer._id || lawyer.id || lawyer.lawyer_id; // adjust this to the real field

  const handleClick = () => {
    if (!lawyerId) {
      console.error('No lawyer ID found for lawyer:', lawyer);
      return;
    }
    onBook(lawyerId);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-slate-800 hover:border-[#FF9000] overflow-hidden">
      <div className="p-5">
        <div className="flex gap-5">
          
          {/* Left: Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative w-28 h-28 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950">
              {lawyer.profilePhotoUrl ? (
                <img
                  src={lawyer.profilePhotoUrl}
                  alt={lawyer.fullName || "Lawyer"}
                  className="w-full h-full object-cover"
                  
                  onError={(e) => {
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src = "https://ui-avatars.com/api/?name=" + (lawyer.fullName || "Lawyer") + "&background=0D8ABC&color=fff";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                  <User className="w-14 h-14 text-white" />
                </div>
              )}
            </div>
            {/* Rating */}
           
          </div>

          {/* Right: Details */}
          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{lawyer.fullName}</h3>
              <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-xs mb-2">
                <Scale className="w-3 h-3" />
                <span>Bar Council: {lawyer.barCouncilNumber}</span>
              </div>
              
              {/* Specializations (practiceAreas in Backend) */}
              <div className="flex flex-wrap gap-1.5">
                {lawyer.practiceAreas && lawyer.practiceAreas.length > 0 ? (
                  lawyer.practiceAreas.map((spec: string, index: number) => (
                    <span 
                      key={index} 
                      className="text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                    >
                      {spec}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 dark:text-slate-500 italic">No practice areas specified</span>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 dark:text-slate-300 truncate">{lawyer.province}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700 dark:text-slate-300">{lawyer.yearsOfExperience} Years Exp.</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 dark:text-slate-300">{lawyer.totalAppointments || 0}+ Appointments</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-amber-600" />
                <span className="text-gray-700 dark:text-slate-100 font-semibold">LKR {lawyer.consultationFee?.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleClick}
             className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-[#FF9000] dark:hover:bg-[#E68200] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer border border-slate-800 dark:border-[#FF9000]/30"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}