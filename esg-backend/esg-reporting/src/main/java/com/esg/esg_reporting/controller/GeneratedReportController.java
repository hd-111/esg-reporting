package com.esg.esg_reporting.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.esg.esg_reporting.entity.GeneratedReport;
import com.esg.esg_reporting.service.GeneratedReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class GeneratedReportController {

    private final GeneratedReportService service;

    @PostMapping
    public GeneratedReport saveGeneratedReport(
            @RequestBody GeneratedReport report) {
        return service.saveGeneratedReport(report);
    }

    @GetMapping
    public List<GeneratedReport> getAllGeneratedReports() {
        return service.getAllGeneratedReports();
    }

    @GetMapping("/{id}")
    public GeneratedReport getGeneratedReportById(@PathVariable Long id) {
        return service.getGeneratedReportById(id);
    }
}