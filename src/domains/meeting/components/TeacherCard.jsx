
import { Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TeacherCard = ({ teacher, onClick }) => {
    const imageUrl = teacher.profileImage || teacher.fileUrl || teacher.url;

    return (
        <div
            onClick={onClick}
            className="group relative bg-white border border-slate-200 rounded-3xl p-6 
        transition-all duration-300 hover:border-blue-400 hover:shadow-xl 
        hover:shadow-blue-500/10 cursor-pointer"
        >
            {/* 상단: 프로필 + 태그 */}
            <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden ring-4 ring-slate-50 
          group-hover:ring-blue-50 transition-all">
                    <img
                        src={
                            imageUrl
                                ? `${import.meta.env.VITE_FILE_URL_HEADER}${imageUrl}`
                                : '/default-avatar.png'
                        }
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = '/default-avatar.png';
                        }}
                    />
                </div>
                <div className="flex gap-1 flex-wrap justify-end">
                    {teacher.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[11px]">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* 이름 + 과목 */}
            <div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors">
                    {teacher.name}
                </h3>
                <p className="text-sm text-slate-500 mb-6">{teacher.subject}</p>
            </div>

            {/* 하단 */}
            <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100">
                <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock size={16} /> 1시간 단위
                </span>
                <span className="font-bold text-blue-600 flex items-center gap-1 
          opacity-0 group-hover:opacity-100 transition-all">
                    예약하기 <ArrowRight size={16} />
                </span>
            </div>
        </div>
    );
};

export default TeacherCard;