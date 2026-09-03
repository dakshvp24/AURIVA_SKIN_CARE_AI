import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, MapPin, Search, CheckCircle2, X, ShieldCheck, Navigation, 
  ArrowUpDown, Info, Map as MapIcon, Calendar, ExternalLink 
} from 'lucide-react';
import { DoctorRecord } from '../../types';
import { loadDoctorsData, extractUniqueValues, extractSplitUniqueValues } from '../../services/dataLoader';
import { 
  getDoctorCoordinates, calculateHaversineDistance, getUserLocation, 
  getGoogleDirectionsUrl, Coordinates 
} from '../../services/geoService';

interface DermatologistDirectoryProps {
  onNavigate: (tab: string) => void;
}

// Diverse representative Indian-style avatars (Gender aware)
const INDIAN_FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1594824813570-78a3337f903a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1594824813570-78a3337f903a?auto=format&fit=crop&w=400&q=80'
];

const INDIAN_MALE_AVATARS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'
];

export const DermatologistDirectory: React.FC<DermatologistDirectoryProps> = ({ onNavigate }) => {
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // User Location Geolocation State
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedConsultType, setSelectedConsultType] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'recommended' | 'nearest' | 'fee_low' | 'experience'>('recommended');

  // Modals: Full Profile Modal & Booking Modal
  const [profileDoctorModal, setProfileDoctorModal] = useState<DoctorRecord | null>(null);
  const [bookingDoctorModal, setBookingDoctorModal] = useState<DoctorRecord | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const data = await loadDoctorsData();
      setDoctors(data);
      setLoading(false);
    }
    init();
  }, []);

  // Dynamic Dataset Values
  const dynamicCities = useMemo(() => ['All', ...extractUniqueValues(doctors, 'city')], [doctors]);
  const dynamicSpecialties = useMemo(() => ['All', ...extractSplitUniqueValues(doctors, 'specialization')], [doctors]);

  // Browser Geolocation
  const handleRequestLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const coords = await getUserLocation();
      setUserCoords(coords);
      setSortOption('nearest');
    } catch (err: any) {
      setLocationError('Location permission denied or unavailable. You can search by city.');
    } finally {
      setLocationLoading(false);
    }
  };

  // Filter & Sort Pipeline
  const filteredDoctors = useMemo(() => {
    const list = doctors.filter(doc => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        doc.doctor_name.toLowerCase().includes(q) ||
        doc.hospital_or_clinic.toLowerCase().includes(q) ||
        doc.city.toLowerCase().includes(q) ||
        doc.location_search_tags.toLowerCase().includes(q) ||
        doc.condition_tags.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (selectedCity !== 'All' && doc.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (selectedSpecialty !== 'All' && !doc.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase())) return false;
      if (selectedConsultType !== 'All' && !doc.consultation_type.toLowerCase().includes(selectedConsultType.toLowerCase())) return false;

      return true;
    });

    return list.sort((a, b) => {
      if (sortOption === 'nearest' && userCoords) {
        const coordsA = getDoctorCoordinates(a);
        const coordsB = getDoctorCoordinates(b);
        const distA = calculateHaversineDistance(userCoords.lat, userCoords.lng, coordsA.lat, coordsA.lng);
        const distB = calculateHaversineDistance(userCoords.lat, userCoords.lng, coordsB.lat, coordsB.lng);
        return distA - distB;
      }

      if (sortOption === 'fee_low') {
        return (parseFloat(String(a.consultation_fee_inr)) || 0) - (parseFloat(String(b.consultation_fee_inr)) || 0);
      }

      if (sortOption === 'experience') {
        return b.years_of_experience - a.years_of_experience;
      }

      return b.rating * 10 + b.years_of_experience - (a.rating * 10 + a.years_of_experience);
    });
  }, [doctors, searchQuery, selectedCity, selectedSpecialty, selectedConsultType, sortOption, userCoords]);

  // Gender-aware avatar fallback
  const getDoctorAvatar = (doc: DoctorRecord, index: number) => {
    if (doc.avatar_url && !doc.avatar_url.includes('placeholder')) {
      return doc.avatar_url;
    }
    const isFemale = doc.gender?.toLowerCase() === 'female';
    const avatarList = isFemale ? INDIAN_FEMALE_AVATARS : INDIAN_MALE_AVATARS;
    return avatarList[index % avatarList.length];
  };

  const confirmAppointment = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingDoctorModal(null);
      setBookingConfirmed(false);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">Auriva Doctor Directory</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111827] mt-1">
            Book Dermatologist Consultation
          </h1>
          <p className="text-sm text-[#4B5563] font-medium mt-1">
            Connect with {doctors.length} verified dermatologists across 25 cities in India. Click "Open Map" to launch Google Maps directions in a new tab.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* User Location Geolocation Button */}
          <button
            onClick={handleRequestLocation}
            disabled={locationLoading}
            className="derm-pill-secondary text-xs px-4 py-2.5 flex items-center gap-2 disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 text-[#2563EB] ${locationLoading ? 'animate-spin' : ''}`} />
            <span>{userCoords ? 'Location Shared' : 'Use My Location'}</span>
          </button>

          <span className="px-4 py-2 rounded-full bg-[#F3F4F1] text-xs font-bold text-[#2D4A3E] border border-[#E5E7EB]">
            {filteredDoctors.length} Doctors Found
          </span>
        </div>
      </div>

      {locationError && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* SEARCH BAR & FILTER CONTROLS */}
      <div className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 text-[#6B7280] absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, clinic name, city, locality, or skin condition treated..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E5E7EB] rounded-2xl text-sm text-[#111827] focus:outline-none focus:border-[#2D4A3E] shadow-xs"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2 bg-white border border-[#E5E7EB] px-4 py-2.5 rounded-2xl shadow-xs">
            <ArrowUpDown className="w-4 h-4 text-[#2D4A3E] shrink-0" />
            <span className="text-xs font-semibold text-[#111827] shrink-0">Sort:</span>
            <select
              value={sortOption}
              onChange={(e: any) => setSortOption(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-[#2D4A3E] focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended & Experience</option>
              {userCoords && <option value="nearest">Nearest to Me (Calculated km)</option>}
              <option value="fee_low">Lowest Consultation Fee</option>
              <option value="experience">Years of Experience</option>
            </select>
          </div>

        </div>

        {/* Dynamic Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E5E7EB] p-4 rounded-2xl shadow-xs">
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#2D4A3E]" />
            <span className="text-xs font-semibold text-[#111827]">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3.5 py-1.5 bg-[#FAFAF8] border border-[#E5E7EB] rounded-full text-xs font-semibold text-[#111827]"
            >
              {dynamicCities.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Cities (25 Cities)' : c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#111827]">Specialty:</span>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-3.5 py-1.5 bg-[#FAFAF8] border border-[#E5E7EB] rounded-full text-xs font-semibold text-[#111827] max-w-[200px] truncate"
            >
              {dynamicSpecialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#111827]">Mode:</span>
            <select
              value={selectedConsultType}
              onChange={(e) => setSelectedConsultType(e.target.value)}
              className="px-3.5 py-1.5 bg-[#FAFAF8] border border-[#E5E7EB] rounded-full text-xs font-semibold text-[#111827]"
            >
              <option value="All">All Consultation Modes</option>
              <option value="Video">Video Consultation Available</option>
              <option value="In-Clinic">In-Clinic Only</option>
            </select>
          </div>

        </div>

      </div>

      {/* DOCTOR CARDS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="derm-card p-6 bg-white border border-[#E5E7EB] animate-pulse space-y-4">
              <div className="h-6 bg-[#F3F4F1] rounded w-1/2" />
              <div className="h-4 bg-[#F3F4F1] rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-white rounded-3xl border border-[#E5E7EB]">
          <User className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#111827]">No matching dermatologist found in the available database.</h3>
          <p className="text-xs text-[#4B5563]">Try adjusting your search query or city selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc, idx) => {
            const coords = getDoctorCoordinates(doc);
            const distanceStr = userCoords 
              ? `${calculateHaversineDistance(userCoords.lat, userCoords.lng, coords.lat, coords.lng)} km away` 
              : null;

            const avatarSrc = getDoctorAvatar(doc, idx);
            const hasLocation = Boolean(doc.clinic_address && doc.city);
            const directionsUrl = getGoogleDirectionsUrl(doc);

            return (
              <div
                key={doc.doctor_id}
                className="derm-card p-6 bg-white border border-[#E5E7EB] hover:border-[#2D4A3E] flex flex-col justify-between transition-all space-y-4"
              >
                <div className="space-y-3">
                  
                  {/* Top Doctor Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={avatarSrc}
                          alt={doc.doctor_name}
                          className="w-14 h-14 rounded-2xl object-cover border border-[#E5E7EB] bg-[#FAFAF8]"
                        />
                        <span 
                          className="absolute -bottom-1 -right-1 text-[9px] bg-[#111827] text-white px-1.5 py-0.5 rounded font-medium"
                          title="Representative Profile Avatar"
                        >
                          Avatar
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-serif text-base font-bold text-[#111827] line-clamp-1">{doc.doctor_name}</h3>
                          {doc.verification_status === 'Verified' && (
                            <span className="p-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0" title="Verified NMC Registration">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-[#2D4A3E] font-bold block">{doc.qualification}</span>
                        <span className="text-xs text-[#4B5563] font-medium block line-clamp-1">{doc.hospital_or_clinic}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fee & Distance Badges */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#F3F4F1] text-xs">
                    <div>
                      <span className="text-[#4B5563]">Consultation Fee:</span>
                      <span className="font-serif text-base font-bold text-[#111827] ml-1">₹{doc.consultation_fee_inr}</span>
                    </div>

                    {distanceStr ? (
                      <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        📍 {distanceStr}
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-[#4B5563]">
                        {doc.city}, {doc.state}
                      </span>
                    )}
                  </div>

                  {/* Address & Specialty */}
                  <div className="space-y-1 text-xs text-[#374151] pt-1">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2D4A3E] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{doc.clinic_address}</span>
                    </div>
                    <div className="line-clamp-1">
                      <strong className="text-[#111827]">Specialty:</strong> {doc.specialization}
                    </div>
                  </div>

                </div>

                {/* Action Buttons: View Profile, Open Map (New Tab), Book */}
                <div className="pt-3 border-t border-[#E5E7EB] flex flex-col space-y-2">
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setProfileDoctorModal(doc)}
                      className="flex-1 py-2 rounded-full bg-[#F3F4F1] border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-[#E5E7EB] transition-colors"
                    >
                      View Profile
                    </button>

                    {hasLocation ? (
                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-full bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#233B31] transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        <MapIcon className="w-3.5 h-3.5" />
                        <span>Open Map</span>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 py-2 rounded-full bg-[#FAFAF8] border border-[#E5E7EB] text-xs font-semibold text-[#9CA3AF] cursor-not-allowed"
                      >
                        Location unavailable
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setBookingDoctorModal(doc)}
                    className="w-full py-2 rounded-full bg-[#FAFAF8] border border-[#E5E7EB] text-xs font-bold text-[#2D4A3E] hover:bg-[#F3F4F1] transition-colors flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Consultation</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* FULL DOCTOR PROFILE MODAL */}
      {profileDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            
            <button
              onClick={() => setProfileDoctorModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6B7280] hover:bg-[#F3F4F1] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pb-4 border-b border-[#E5E7EB]">
              <img
                src={profileDoctorModal.avatar_url || INDIAN_FEMALE_AVATARS[0]}
                alt={profileDoctorModal.doctor_name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#E5E7EB]"
              />
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#111827]">{profileDoctorModal.doctor_name}</h3>
                <span className="text-xs font-bold text-[#2D4A3E] block">{profileDoctorModal.qualification}</span>
                <span className="text-xs text-[#4B5563] font-medium">{profileDoctorModal.hospital_or_clinic} • {profileDoctorModal.city}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#374151]">
              <div><strong className="text-[#111827] block">Specialization:</strong> {profileDoctorModal.specialization}</div>
              <div><strong className="text-[#111827] block">Conditions Treated:</strong> {profileDoctorModal.skin_conditions_treated}</div>
              <div><strong className="text-[#111827] block">Full Clinic Address:</strong> {profileDoctorModal.clinic_address}</div>
              <div><strong className="text-[#111827] block">NMC Registration:</strong> {profileDoctorModal.professional_registration_available}</div>
            </div>

            <div className="pt-4 flex gap-3">
              <a
                href={getGoogleDirectionsUrl(profileDoctorModal)}
                target="_blank"
                rel="noopener noreferrer"
                className="derm-pill-btn text-xs px-6 py-2.5 flex-1 flex items-center justify-center gap-1.5"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Open Map ↗</span>
              </a>
              <button
                onClick={() => setProfileDoctorModal(null)}
                className="derm-pill-secondary text-xs px-4 py-2.5"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* BOOKING CONSULTATION MODAL */}
      {bookingDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            <button
              onClick={() => setBookingDoctorModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6B7280] hover:bg-[#F3F4F1] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#2D4A3E] text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#111827]">Appointment Request Sent!</h3>
                <p className="text-xs text-[#4B5563]">
                  Consultation request submitted for <strong>{bookingDoctorModal.doctor_name}</strong> ({bookingDoctorModal.hospital_or_clinic}). Confirmation details sent to your registered profile.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E]">Confirm Appointment</span>
                  <h3 className="font-serif text-2xl font-bold text-[#111827]">{bookingDoctorModal.doctor_name}</h3>
                  <span className="text-xs text-[#4B5563] font-medium block">{bookingDoctorModal.hospital_or_clinic} • {bookingDoctorModal.city}</span>
                </div>

                <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                    <span className="text-[#4B5563]">Qualification:</span>
                    <span className="font-semibold text-[#111827]">{bookingDoctorModal.qualification}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#4B5563]">Consultation Fee:</span>
                    <span className="font-bold text-[#111827]">₹{bookingDoctorModal.consultation_fee_inr}</span>
                  </div>
                </div>

                <button
                  onClick={confirmAppointment}
                  className="w-full py-3 rounded-full bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#233B31] transition-all shadow-sm"
                >
                  Confirm Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
