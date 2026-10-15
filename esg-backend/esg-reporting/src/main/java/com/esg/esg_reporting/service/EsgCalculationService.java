package com.esg.esg_reporting.service;

import org.springframework.stereotype.Service;

@Service
public class EsgCalculationService {

    public double calculateEmployeeTurnover(
            int employeeDepartures,
            int employeesAtStart,
            int employeesAtEnd) {

        double averageEmployees =
                (employeesAtStart + employeesAtEnd) / 2.0;

        if (averageEmployees == 0) {
            return 0.0;
        }

        return (employeeDepartures / averageEmployees) * 100.0;
    }

    public double calculateTrainingHoursPerEmployee(
            double totalTrainingHours,
            int totalEmployees) {

        if (totalEmployees == 0) {
            return 0.0;
        }

        return totalTrainingHours / totalEmployees;
    }

    public double calculateRecyclingPercentage(
            double recycledWaste,
            double totalWaste) {

        if (totalWaste == 0) {
            return 0.0;
        }

        return (recycledWaste / totalWaste) * 100.0;
    }

    public double calculateIndependentBoardPercentage(
            int independentBoardMembers,
            int totalBoardMembers) {

        if (totalBoardMembers == 0) {
            return 0.0;
        }

        return (independentBoardMembers / (double) totalBoardMembers)
                * 100.0;
    }
}