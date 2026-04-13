export default interface CourseInterface{
    id : string;
    img_url : string;
    status_vacancy : number;
    title : string;
    period_day : number;
    address : string;
    targetAudience : string;
    minAge : number;
    schooldays : string;
    workload : number;
    minimumEducation : string;
    description : string;
    code : string;
    availablePosition : number;
    classPeriodStart : Date | string;
    classPeriodEnd : Date | string;
    subscriptionStartDate : Date | string;
    subscriptionEndDate : Date | string;
    courseStart : Date | string;
    courseEnd : Date | string;
    createdAt : Date | string;
    updatedAt : Date | string;
    category : {
        id : string;
        title : string;
        isActive : boolean;
        createdAt : Date | string;
        updatedAt : Date | string;
    }
}