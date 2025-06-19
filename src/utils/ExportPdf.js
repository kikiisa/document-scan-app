import jsPDF from "jspdf";
export const exportToPDF = (data) => { 
    const doc = new jsPDF({
        orientation:"portrait",
        unit:"px",
        format:[data.width,data.height]
    });
}

