package com.esg.esg_reporting.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.esg.esg_reporting.entity.ReportingPeriod;
import com.esg.esg_reporting.service.ReportingPeriodService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reporting-periods")
@RequiredArgsConstructor
public class ReportingPeriodController {

    private final ReportingPeriodService service;

    @PostMapping
    public ReportingPeriod saveReportingPeriod(
            @RequestBody ReportingPeriod period) {
        return service.saveReportingPeriod(period);
    }

    @GetMapping
    public List<ReportingPeriod> getAllReportingPeriods() {
        return service.getAllReportingPeriods();
    }

    @GetMapping("/{id}")
    public ReportingPeriod getReportingPeriodById(
            @PathVariable Long id) {
        return service.getReportingPeriodById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteReportingPeriod(@PathVariable Long id) {
        service.deleteReportingPeriod(id);
        return "Reporting period deleted successfully";
    }
}