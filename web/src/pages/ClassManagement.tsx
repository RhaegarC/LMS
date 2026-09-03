import { useState } from "react";

const classes = [
  {
    id: 1, name: "Level 1 – Red", description: "Beginner English for ages 6–7. Focus on alphabet, numbers, and basic greetings.",
    students: [
      { id: 1, name: "Lily Wang", email: "lily.w@school.edu", joined: "Aug 1, 2026" },
      { id: 2, name: "Tom Baker", email: "tom.b@school.edu", joined: "Aug 1, 2026" },
      { id: 3, name: "Mia Chen", email: "mia.c@school.edu", joined: "Aug 5, 2026" },
      { id: 4, name: "Jack Kim", email: "jack.k@school.edu", joined: "Aug 10, 2026" },
      { id: 5, name: "Sophie Liu", email: "sophie.l@school.edu", joined: "Aug 15, 2026" },
    ],
    color: "border-t-[#FF6B47]",
  },
  {
    id: 2, name: "Level 1 – Blue", description: "Beginner English for ages 7–8. Basic vocabulary and sentence structure.",
    students: [
      { id: 6, name: "Emma Davis", email: "emma.d@school.edu", joined: "Aug 1, 2026" },
      { id: 7, name: "Ryan Park", email: "ryan.p@school.edu", joined: "Aug 1, 2026" },
      { id: 8, name: "Zoe Martinez", email: "zoe.m@school.edu", joined: "Aug 3, 2026" },
      { id: 9, name: "Lucas Brown", email: "lucas.b@school.edu", joined: "Aug 8, 2026" },
    ],
    color: "border-t-[#6C47FF]",
  },
  {
    id: 3, name: "Level 2 – Green", description: "Elementary English for ages 8–9. Reading, writing and conversation.",
    students: [
      { id: 10, name: "Ava Wilson", email: "ava.w@school.edu", joined: "Aug 1, 2026" },
      { id: 11, name: "Noah Taylor", email: "noah.t@school.edu", joined: "Aug 2, 2026" },
      { id: 12, name: "Isabella Lee", email: "isabella.l@school.edu", joined: "Aug 6, 2026" },
    ],
    color: "border-t-[#47D6B5]",
  },
];

const initials = (name: string) => name.split(" ").map((n) => n[0]).join("");
const avatarColors = [
  "bg-purple-200 text-purple-700", "bg-amber-200 text-amber-700",
  "bg-teal-200 text-teal-700", "bg-rose-200 text-rose-700", "bg-blue-200 text-blue-700",
];

export default function ClassManagement() {
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [searchStudents, setSearchStudents] = useState("");
  const [confirmRemove, setConfirmRemove] = useState<number | null>(null);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Classes</h1>
          <p className="text-gray-500 text-sm mt-1">{classes.length} classes · {classes.reduce((a, c) => a + c.students.length, 0)} students total</p>
        </div>
        <button
          onClick={() => setShowCreateClass(true)}
          className="flex items-center gap-2 bg-[#6C47FF] hover:bg-[#5535e0] text-white font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-purple-200 self-start"
        >
          + New Class
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class list */}
        <div className="space-y-3">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className={`w-full text-left bg-white rounded-2xl border border-[#E5E0F5] border-t-4 ${cls.color} p-4 transition-all ${
                selectedClass.id === cls.id ? "shadow-md ring-2 ring-[#6C47FF]/20" : "hover:shadow-sm"
              }`}
            >
              <div className="font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>{cls.name}</div>
              <div className="text-xs text-gray-400 mt-1 line-clamp-2">{cls.description}</div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {cls.students.slice(0, 4).map((s, i) => (
                    <div key={s.id} className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black ${avatarColors[i % avatarColors.length]}`}>
                      {initials(s.name)}
                    </div>
                  ))}
                  {cls.students.length > 4 && (
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500">
                      +{cls.students.length - 4}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-400">{cls.students.length} students</span>
              </div>
            </button>
          ))}

          {/* Create class modal */}
          {showCreateClass && (
            <div className="bg-white rounded-2xl border-2 border-[#6C47FF]/30 p-4">
              <div className="font-black text-[#1A1033] mb-3" style={{ fontFamily: "Nunito, sans-serif" }}>New Class</div>
              <input
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Class name…"
                maxLength={100}
                className="w-full border border-[#E5E0F5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6C47FF] mb-2"
              />
              <textarea
                placeholder="Description (optional)…"
                rows={2}
                className="w-full border border-[#E5E0F5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6C47FF] resize-none mb-3"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowCreateClass(false)} className="flex-1 text-sm font-bold text-gray-500 py-2 rounded-xl border border-[#E5E0F5] hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={() => setShowCreateClass(false)} className="flex-1 text-sm font-bold text-white py-2 rounded-xl bg-[#6C47FF] hover:bg-[#5535e0]">
                  Create
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Class detail */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#E5E0F5] overflow-hidden">
            {/* Class header */}
            <div className={`border-t-4 ${selectedClass.color} px-6 py-5 border-b border-[#E5E0F5]`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>{selectedClass.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedClass.description}</p>
                </div>
                <button className="text-xs font-bold text-[#6C47FF] hover:underline">Edit</button>
              </div>
            </div>

            {/* Student roster */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>
                  Students ({selectedClass.students.length})
                </h3>
                <button
                  onClick={() => setShowAddStudent(!showAddStudent)}
                  className="text-xs font-bold bg-[#F0EBFF] text-[#6C47FF] px-3 py-1.5 rounded-xl hover:bg-[#6C47FF] hover:text-white transition-colors"
                >
                  + Add Student
                </button>
              </div>

              {showAddStudent && (
                <div className="mb-4 p-4 bg-[#F0EBFF] rounded-xl">
                  <div className="text-sm font-bold text-[#1A1033] mb-2">Search students</div>
                  <div className="relative mb-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                    <input
                      value={searchStudents}
                      onChange={(e) => setSearchStudents(e.target.value)}
                      placeholder="Search by name or email…"
                      className="w-full bg-white border border-[#E5E0F5] rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#6C47FF]"
                    />
                  </div>
                  {searchStudents && (
                    <div className="bg-white rounded-xl border border-[#E5E0F5] divide-y divide-[#F0EBFF]">
                      {["Oliver Wright", "Chloe Anderson", "Ethan Scott"].map((name) => (
                        <div key={name} className="flex items-center justify-between px-3 py-2.5">
                          <span className="text-sm font-semibold">{name}</span>
                          <button
                            onClick={() => setShowAddStudent(false)}
                            className="text-xs font-bold bg-[#6C47FF] text-white px-2.5 py-1 rounded-lg hover:bg-[#5535e0]"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {selectedClass.students.map((student, i) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F4F2F0] transition-colors group">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-none ${avatarColors[i % avatarColors.length]}`}>
                      {initials(student.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-[#1A1033]">{student.name}</div>
                      <div className="text-xs text-gray-400">{student.email}</div>
                    </div>
                    <div className="text-xs text-gray-400 hidden group-hover:hidden lg:block">
                      Joined {student.joined}
                    </div>
                    {confirmRemove === student.id ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setConfirmRemove(null)}
                          className="text-xs font-bold text-gray-500 px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setConfirmRemove(null)}
                          className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-lg hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmRemove(student.id)}
                        className="text-xs text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all font-bold"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
