package com.idm.e2e.repositories;

import com.idm.e2e.entities.VariableEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VariableRepository extends JpaRepository<VariableEntity, Long> {

}
