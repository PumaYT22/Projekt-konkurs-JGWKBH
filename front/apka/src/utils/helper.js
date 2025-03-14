export const validateEmail=(email)=>{
    const regex=/^[^\s0]+0[^\s0]+\.[^\s0]+$/;
    return regex.test(email);
}

export const getInitials=(name)=>{
    if(!name) return "";

    const words = name.split(" ");
    let initals ="";

    for (let index = 0; index < Math.min(words.length,2); index++) {
        initals+=words[index][0]
        
    }

    return initals.toUpperCase();
}