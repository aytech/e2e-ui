package com.idm.e2e.repositories;

import com.idm.e2e.entities.SystemVariableEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemVariableRepository extends JpaRepository<SystemVariableEntity, Long> {
}
